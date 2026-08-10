<?php

declare(strict_types=1);

function default_config(): array
{
    return [
    'admin_user' => 'admin',
    'admin_password' => 'change-me',
    'public_site_url' => 'https://rwscargo.ru',
    'data_file' => __DIR__ . '/data/leads.json',
    'telegram_bot_token' => '',
    'telegram_chat_id' => '',
    ];
}

function load_config(): array
{
    $configPath = __DIR__ . '/config.php';
    $config = is_file($configPath) ? require $configPath : [];

    return array_merge(default_config(), is_array($config) ? $config : []);
}

function send_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input') ?: '';

    if (strlen($raw) > 256000) {
        send_json(413, ['ok' => false, 'error' => 'Payload too large']);
        exit;
    }

    if (trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);

    if (!is_array($decoded)) {
        send_json(400, ['ok' => false, 'error' => 'Invalid JSON']);
        exit;
    }

    return $decoded;
}

function clean_string(mixed $value): string
{
    return trim((string) ($value ?? ''));
}

function make_uuid(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function read_leads_file(string $dataFile): array
{
    if (!is_file($dataFile)) {
        return [];
    }

    $raw = file_get_contents($dataFile);
    $decoded = json_decode($raw ?: '[]', true);

    return is_array($decoded) ? $decoded : [];
}

function ensure_data_file(string $dataFile): void
{
    $dir = dirname($dataFile);

    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }

    if (!is_file($dataFile)) {
        file_put_contents($dataFile, "[]\n", LOCK_EX);
    }
}

function with_leads_lock(string $dataFile, callable $callback): mixed
{
    ensure_data_file($dataFile);
    $handle = fopen($dataFile, 'c+');

    if (!$handle) {
        throw new RuntimeException('Cannot open lead storage');
    }

    flock($handle, LOCK_EX);
    $raw = stream_get_contents($handle);
    $leads = json_decode($raw !== false && trim($raw) !== '' ? $raw : '[]', true);
    $leads = is_array($leads) ? $leads : [];
    $result = $callback($leads);

    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($leads, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . "\n");
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return $result;
}

function has_admin_access(array $config): bool
{
    $user = $_SERVER['PHP_AUTH_USER'] ?? null;
    $password = $_SERVER['PHP_AUTH_PW'] ?? null;

    if ($user === null || $password === null) {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';

        if (str_starts_with($header, 'Basic ')) {
            $decoded = base64_decode(substr($header, 6), true);

            if ($decoded !== false && str_contains($decoded, ':')) {
                [$user, $password] = explode(':', $decoded, 2);
            }
        }
    }

    return hash_equals((string) $config['admin_user'], (string) $user)
        && hash_equals((string) $config['admin_password'], (string) $password);
}

function normalize_lead(array $input): array
{
    $consents = is_array($input['consents'] ?? null) ? $input['consents'] : [];
    $tasks = is_array($input['tasks'] ?? null)
        ? array_values(array_filter(array_map('clean_string', $input['tasks'])))
        : [];

    $lead = [
        'id' => make_uuid(),
        'created_at' => gmdate('c'),
        'updated_at' => gmdate('c'),
        'status' => 'new',
        'source' => clean_string($input['source'] ?? 'site') ?: 'site',
        'name' => clean_string($input['name'] ?? ''),
        'phone' => clean_string($input['phone'] ?? ''),
        'email' => clean_string($input['email'] ?? ''),
        'telegram' => clean_string($input['telegram'] ?? ''),
        'whatsapp' => clean_string($input['whatsapp'] ?? ''),
        'preferred_contact' => clean_string($input['preferredContact'] ?? ''),
        'import_format' => clean_string($input['importFormat'] ?? ''),
        'tasks' => $tasks,
        'payload' => [
            'supplierLink' => clean_string($input['supplierLink'] ?? ''),
            'cargo' => clean_string($input['cargo'] ?? ''),
            'weight' => clean_string($input['weight'] ?? ''),
            'volume' => clean_string($input['volume'] ?? ''),
            'city' => clean_string($input['city'] ?? ''),
            'comment' => clean_string($input['comment'] ?? ''),
            'calculator' => is_array($input['calculator'] ?? null) ? $input['calculator'] : null,
            'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'referer' => $_SERVER['HTTP_REFERER'] ?? '',
        ],
        'notification_status' => [],
    ];

    $hasContact = $lead['phone'] || $lead['email'] || $lead['telegram'] || $lead['whatsapp'];

    if (!$hasContact) {
        return ['ok' => false, 'error' => 'Укажите хотя бы один способ связи.'];
    }

    if (empty($consents['personalData']) || empty($consents['contact']) || empty($consents['legalCargo'])) {
        return ['ok' => false, 'error' => 'Подтвердите обязательные согласия.'];
    }

    return ['ok' => true, 'lead' => $lead];
}

function lead_text(array $lead): string
{
    $payload = is_array($lead['payload'] ?? null) ? $lead['payload'] : [];
    $lines = [
        'Новая заявка RWSCargo',
        'ID: ' . $lead['id'],
        'Имя: ' . ($lead['name'] ?: 'не указано'),
        'Телефон: ' . ($lead['phone'] ?: 'не указан'),
        'Email: ' . ($lead['email'] ?: 'не указан'),
        'Telegram: ' . ($lead['telegram'] ?: 'не указан'),
        'WhatsApp: ' . ($lead['whatsapp'] ?: 'не указан'),
        'Удобный канал: ' . ($lead['preferred_contact'] ?: 'не выбран'),
        'Формат: ' . ($lead['import_format'] ?: 'не выбран'),
        'Задачи: ' . (count($lead['tasks']) ? implode(', ', $lead['tasks']) : 'не выбраны'),
        'Груз: ' . (($payload['cargo'] ?? '') ?: 'не указан'),
        'Поставщик: ' . (($payload['supplierLink'] ?? '') ?: 'не указан'),
        'Вес: ' . (($payload['weight'] ?? '') ?: 'не указан'),
        'Объем: ' . (($payload['volume'] ?? '') ?: 'не указан'),
        'Город: ' . (($payload['city'] ?? '') ?: 'не указан'),
        'Комментарий: ' . (($payload['comment'] ?? '') ?: 'не указан'),
    ];

    if (is_array($payload['calculator'] ?? null)) {
        $lines[] = 'Ориентир калькулятора: ' . (($payload['calculator']['estimate'] ?? '') ?: 'не указан');
    }

    return implode("\n", $lines);
}

function notify_telegram(array $lead, array $config): array
{
    if (!$config['telegram_bot_token'] || !$config['telegram_chat_id']) {
        return ['skipped' => true, 'reason' => 'Telegram is not configured'];
    }

    $siteUrl = rtrim((string) $config['public_site_url'], '/');
    $body = [
        'chat_id' => $config['telegram_chat_id'],
        'text' => lead_text($lead),
        'disable_web_page_preview' => true,
    ];

    if ($siteUrl !== '') {
        $body['reply_markup'] = [
            'inline_keyboard' => [[['text' => 'Открыть CRM', 'url' => $siteUrl . '/admin/leads/#' . $lead['id']]]],
        ];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'timeout' => 8,
        ],
    ]);
    $url = 'https://api.telegram.org/bot' . rawurlencode((string) $config['telegram_bot_token']) . '/sendMessage';
    $result = @file_get_contents($url, false, $context);

    if ($result === false) {
        return ['ok' => false, 'error' => 'Telegram request failed'];
    }

    return ['ok' => true];
}

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = preg_replace('#^/api(?=/|$)#', '', $path);
    $path = $path === '' ? '/' : rtrim($path, '/') ?: '/';

    if ($method === 'OPTIONS') {
        http_response_code(204);
        header('Access-Control-Allow-Methods: GET,POST,PATCH,OPTIONS');
        header('Access-Control-Allow-Headers: content-type, authorization');
        exit;
    }

    if ($method === 'GET' && ($path === '/' || $path === '/health' || $path === '/index.php')) {
        send_json(200, ['ok' => true]);
        exit;
    }

    $config = load_config();

    if ($method === 'POST' && $path === '/leads') {
        $normalized = normalize_lead(read_json_body());

        if (!$normalized['ok']) {
            send_json(422, ['ok' => false, 'error' => $normalized['error']]);
            exit;
        }

        $lead = $normalized['lead'];
        $lead['notification_status']['telegram'] = notify_telegram($lead, $config);
        with_leads_lock((string) $config['data_file'], function (array &$leads) use ($lead): void {
            array_unshift($leads, $lead);
        });
        send_json(201, ['ok' => true, 'id' => $lead['id'], 'notificationStatus' => $lead['notification_status']]);
        exit;
    }

    if ($method === 'GET' && $path === '/leads') {
        if (!has_admin_access($config)) {
            header('WWW-Authenticate: Basic realm="RWSCargo CRM"');
            send_json(401, ['ok' => false, 'error' => 'Unauthorized']);
            exit;
        }

        send_json(200, ['ok' => true, 'leads' => array_slice(read_leads_file((string) $config['data_file']), 0, 300)]);
        exit;
    }

    if ($method === 'PATCH' && preg_match('#^/leads/([0-9a-f-]{36})$#i', $path, $matches)) {
        if (!has_admin_access($config)) {
            send_json(401, ['ok' => false, 'error' => 'Unauthorized']);
            exit;
        }

        $input = read_json_body();
        $status = clean_string($input['status'] ?? '');

        if (!in_array($status, ['new', 'in_progress', 'closed'], true)) {
            send_json(422, ['ok' => false, 'error' => 'Unknown status']);
            exit;
        }

        $updated = with_leads_lock((string) $config['data_file'], function (array &$leads) use ($matches, $status): ?array {
            foreach ($leads as &$lead) {
                if (($lead['id'] ?? '') === $matches[1]) {
                    $lead['status'] = $status;
                    $lead['updated_at'] = gmdate('c');

                    return $lead;
                }
            }

            return null;
        });

        if (!$updated) {
            send_json(404, ['ok' => false, 'error' => 'Lead not found']);
            exit;
        }

        send_json(200, ['ok' => true, 'lead' => [
            'id' => $updated['id'],
            'status' => $updated['status'],
            'updated_at' => $updated['updated_at'],
        ]]);
        exit;
    }

    send_json(404, ['ok' => false, 'error' => 'Not found', 'pathname' => $path]);
} catch (Throwable $error) {
    error_log($error);
    send_json(500, ['ok' => false, 'error' => 'Server error']);
}
