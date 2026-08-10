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
    'smtp_host' => '',
    'smtp_port' => 587,
    'smtp_secure' => false,
    'smtp_user' => '',
    'smtp_pass' => '',
    'lead_email_to' => '',
    'lead_email_from' => 'RWSCargo <leads@rwscargo.ru>',
    'push_subscriptions_file' => __DIR__ . '/data/push-subscriptions.json',
    'vapid_public_key' => '',
    'vapid_private_key' => '',
    'vapid_subject' => 'mailto:leads@rwscargo.ru',
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

function with_json_lock(string $dataFile, callable $callback, array $default = []): mixed
{
    ensure_data_file($dataFile);
    $handle = fopen($dataFile, 'c+');

    if (!$handle) {
        throw new RuntimeException('Cannot open JSON storage');
    }

    flock($handle, LOCK_EX);
    $raw = stream_get_contents($handle);
    $items = json_decode($raw !== false && trim($raw) !== '' ? $raw : json_encode($default), true);
    $items = is_array($items) ? $items : $default;
    $result = $callback($items);

    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($items, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . "\n");
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

function header_line(string $value): string
{
    return trim(str_replace(["\r", "\n"], '', $value));
}

function extract_email(string $value): string
{
    if (preg_match('/<([^>]+)>/', $value, $matches)) {
        return trim($matches[1]);
    }

    return trim($value);
}

function smtp_read($stream): array
{
    $message = '';
    $code = 0;

    while (($line = fgets($stream, 1024)) !== false) {
        $message .= $line;
        $code = (int) substr($line, 0, 3);

        if (strlen($line) >= 4 && $line[3] === ' ') {
            break;
        }
    }

    return [$code, $message];
}

function smtp_command($stream, string $command, array $expected): string
{
    if ($command !== '') {
        fwrite($stream, $command . "\r\n");
    }

    [$code, $message] = smtp_read($stream);

    if (!in_array($code, $expected, true)) {
        throw new RuntimeException('SMTP error: ' . trim($message));
    }

    return $message;
}

function smtp_body(string $text): string
{
    $normalized = preg_replace("/\r\n|\r|\n/", "\r\n", $text);
    $lines = explode("\r\n", (string) $normalized);

    return implode("\r\n", array_map(static function (string $line): string {
        return str_starts_with($line, '.') ? '.' . $line : $line;
    }, $lines));
}

function notify_email(array $lead, array $config): array
{
    $to = header_line((string) ($config['lead_email_to'] ?? ''));

    if ($to === '') {
        return ['skipped' => true, 'reason' => 'LEAD_EMAIL_TO is not set'];
    }

    $host = (string) ($config['smtp_host'] ?? '');
    $from = header_line((string) ($config['lead_email_from'] ?? 'RWSCargo <leads@rwscargo.ru>'));
    $fromEmail = extract_email($from);
    $subject = 'Новая заявка RWSCargo';
    $text = lead_text($lead);
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $headers = [
        'From: ' . $from,
        'To: ' . $to,
        'Subject: ' . $encodedSubject,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'Date: ' . date('r'),
    ];

    if ($host === '') {
        $sent = mail($to, $encodedSubject, $text, implode("\r\n", array_filter($headers, static function (string $line): bool {
            return !str_starts_with($line, 'To: ') && !str_starts_with($line, 'Subject: ');
        })));

        return $sent ? ['ok' => true, 'transport' => 'mail'] : ['ok' => false, 'error' => 'PHP mail failed'];
    }

    try {
        $port = (int) ($config['smtp_port'] ?? 587);
        $secure = !empty($config['smtp_secure']);
        $socketHost = ($secure ? 'ssl://' : '') . $host;
        $stream = stream_socket_client($socketHost . ':' . $port, $errno, $errstr, 8, STREAM_CLIENT_CONNECT);

        if (!$stream) {
            return ['ok' => false, 'error' => 'SMTP connect failed: ' . $errstr];
        }

        stream_set_timeout($stream, 8);
        smtp_command($stream, '', [220]);
        $ehlo = smtp_command($stream, 'EHLO rwscargo.ru', [250]);

        if (!$secure && stripos($ehlo, 'STARTTLS') !== false) {
            smtp_command($stream, 'STARTTLS', [220]);

            if (!stream_socket_enable_crypto($stream, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('SMTP STARTTLS failed');
            }

            smtp_command($stream, 'EHLO rwscargo.ru', [250]);
        }

        if (!empty($config['smtp_user'])) {
            smtp_command($stream, 'AUTH LOGIN', [334]);
            smtp_command($stream, base64_encode((string) $config['smtp_user']), [334]);
            smtp_command($stream, base64_encode((string) ($config['smtp_pass'] ?? '')), [235]);
        }

        smtp_command($stream, 'MAIL FROM:<' . $fromEmail . '>', [250]);

        foreach (preg_split('/[,;]/', $to) as $recipient) {
            $recipient = extract_email((string) $recipient);

            if ($recipient !== '') {
                smtp_command($stream, 'RCPT TO:<' . $recipient . '>', [250, 251]);
            }
        }

        smtp_command($stream, 'DATA', [354]);
        fwrite($stream, implode("\r\n", $headers) . "\r\n\r\n" . smtp_body($text) . "\r\n.\r\n");
        smtp_command($stream, '', [250]);
        smtp_command($stream, 'QUIT', [221]);
        fclose($stream);

        return ['ok' => true, 'transport' => 'smtp'];
    } catch (Throwable $error) {
        if (isset($stream) && is_resource($stream)) {
            fclose($stream);
        }

        return ['ok' => false, 'error' => $error->getMessage()];
    }
}

function base64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function base64url_decode(string $value): string
{
    $decoded = base64_decode(strtr($value, '-_', '+/') . str_repeat('=', (4 - strlen($value) % 4) % 4), true);

    return $decoded === false ? '' : $decoded;
}

function asn1_length(int $length): string
{
    if ($length < 128) {
        return chr($length);
    }

    $bytes = '';

    while ($length > 0) {
        $bytes = chr($length & 0xff) . $bytes;
        $length >>= 8;
    }

    return chr(0x80 | strlen($bytes)) . $bytes;
}

function asn1_wrap(int $tag, string $value): string
{
    return chr($tag) . asn1_length(strlen($value)) . $value;
}

function ec_public_key_pem(string $publicKey): string
{
    $ecPublicKeyOid = hex2bin('06072A8648CE3D0201');
    $prime256v1Oid = hex2bin('06082A8648CE3D030107');
    $algorithm = asn1_wrap(0x30, $ecPublicKeyOid . $prime256v1Oid);
    $bitString = asn1_wrap(0x03, "\x00" . $publicKey);
    $der = asn1_wrap(0x30, $algorithm . $bitString);

    return "-----BEGIN PUBLIC KEY-----\n" . chunk_split(base64_encode($der), 64, "\n") . "-----END PUBLIC KEY-----\n";
}

function ec_private_key_pem(string $privateKey, string $publicKey): string
{
    $prime256v1Oid = hex2bin('06082A8648CE3D030107');
    $version = asn1_wrap(0x02, "\x01");
    $private = asn1_wrap(0x04, $privateKey);
    $parameters = asn1_wrap(0xa0, $prime256v1Oid);
    $public = asn1_wrap(0xa1, asn1_wrap(0x03, "\x00" . $publicKey));
    $der = asn1_wrap(0x30, $version . $private . $parameters . $public);

    return "-----BEGIN EC PRIVATE KEY-----\n" . chunk_split(base64_encode($der), 64, "\n") . "-----END EC PRIVATE KEY-----\n";
}

function der_to_jose_signature(string $der): string
{
    $offset = 0;
    $readLength = static function () use ($der, &$offset): int {
        $length = ord($der[$offset++]);

        if ($length < 128) {
            return $length;
        }

        $bytes = $length & 0x7f;
        $length = 0;

        for ($i = 0; $i < $bytes; $i++) {
            $length = ($length << 8) | ord($der[$offset++]);
        }

        return $length;
    };
    $readInteger = static function () use ($der, &$offset, $readLength): string {
        if (ord($der[$offset++]) !== 0x02) {
            throw new RuntimeException('Invalid ECDSA signature');
        }

        $length = $readLength();
        $value = substr($der, $offset, $length);
        $offset += $length;
        $value = ltrim($value, "\x00");

        if (strlen($value) > 32) {
            $value = substr($value, -32);
        }

        return str_pad($value, 32, "\x00", STR_PAD_LEFT);
    };

    if (ord($der[$offset++]) !== 0x30) {
        throw new RuntimeException('Invalid ECDSA signature');
    }

    $readLength();

    return $readInteger() . $readInteger();
}

function hkdf_expand(string $key, string $info, int $length): string
{
    $output = '';
    $block = '';

    for ($counter = 1; strlen($output) < $length; $counter++) {
        $block = hash_hmac('sha256', $block . $info . chr($counter), $key, true);
        $output .= $block;
    }

    return substr($output, 0, $length);
}

function vapid_jwt(string $endpoint, array $config): string
{
    $publicKey = base64url_decode((string) $config['vapid_public_key']);
    $privateKey = base64url_decode((string) $config['vapid_private_key']);

    if (strlen($publicKey) !== 65 || strlen($privateKey) !== 32) {
        throw new RuntimeException('Invalid VAPID keys');
    }

    $parts = parse_url($endpoint);
    $audience = ($parts['scheme'] ?? 'https') . '://' . ($parts['host'] ?? '');
    $header = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'ES256'], JSON_UNESCAPED_SLASHES));
    $claims = base64url_encode(json_encode([
        'aud' => $audience,
        'exp' => time() + 43200,
        'sub' => (string) $config['vapid_subject'],
    ], JSON_UNESCAPED_SLASHES));
    $input = $header . '.' . $claims;
    $pem = ec_private_key_pem($privateKey, $publicKey);

    if (!openssl_sign($input, $signature, $pem, OPENSSL_ALGO_SHA256)) {
        throw new RuntimeException('Cannot sign VAPID JWT');
    }

    return $input . '.' . base64url_encode(der_to_jose_signature($signature));
}

function web_push_encrypt(array $subscription, string $payload): array
{
    $keys = is_array($subscription['keys'] ?? null) ? $subscription['keys'] : [];
    $clientPublicKey = base64url_decode((string) ($keys['p256dh'] ?? ''));
    $authSecret = base64url_decode((string) ($keys['auth'] ?? ''));

    if (strlen($clientPublicKey) !== 65 || strlen($authSecret) < 16) {
        throw new RuntimeException('Invalid push subscription keys');
    }

    $serverKey = openssl_pkey_new([
        'private_key_type' => OPENSSL_KEYTYPE_EC,
        'curve_name' => 'prime256v1',
    ]);

    if (!$serverKey) {
        throw new RuntimeException('Cannot create ECDH key');
    }

    $details = openssl_pkey_get_details($serverKey);
    $x = str_pad((string) ($details['ec']['x'] ?? ''), 32, "\x00", STR_PAD_LEFT);
    $y = str_pad((string) ($details['ec']['y'] ?? ''), 32, "\x00", STR_PAD_LEFT);
    $serverPublicKey = "\x04" . $x . $y;
    $peerKey = openssl_pkey_get_public(ec_public_key_pem($clientPublicKey));
    $sharedSecret = $peerKey ? openssl_pkey_derive($peerKey, $serverKey, 32) : false;

    if ($sharedSecret === false) {
        throw new RuntimeException('Cannot derive push shared secret');
    }

    $salt = random_bytes(16);
    $keyInfo = "WebPush: info\x00" . $clientPublicKey . $serverPublicKey;
    $contentEncryptionKeyInfo = "Content-Encoding: aes128gcm\x00";
    $nonceInfo = "Content-Encoding: nonce\x00";
    $prk = hash_hmac('sha256', $sharedSecret, $authSecret, true);
    $ikm = hkdf_expand($prk, $keyInfo, 32);
    $context = hash_hmac('sha256', $ikm, $salt, true);
    $contentEncryptionKey = hkdf_expand($context, $contentEncryptionKeyInfo, 16);
    $nonce = hkdf_expand($context, $nonceInfo, 12);
    $ciphertext = openssl_encrypt($payload . "\x02", 'aes-128-gcm', $contentEncryptionKey, OPENSSL_RAW_DATA, $nonce, $tag);

    if ($ciphertext === false) {
        throw new RuntimeException('Cannot encrypt push payload');
    }

    return [
        'body' => $salt . pack('N', 4096) . chr(strlen($serverPublicKey)) . $serverPublicKey . $ciphertext . $tag,
        'serverPublicKey' => $serverPublicKey,
    ];
}

function send_web_push(array $subscription, array $payload, array $config): array
{
    if (!$config['vapid_public_key'] || !$config['vapid_private_key']) {
        return ['skipped' => true, 'reason' => 'Web Push is not configured'];
    }

    $endpoint = clean_string($subscription['endpoint'] ?? '');

    if ($endpoint === '') {
        return ['ok' => false, 'error' => 'Missing push endpoint'];
    }

    try {
        $encodedPayload = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $encrypted = web_push_encrypt($subscription, $encodedPayload === false ? '{}' : $encodedPayload);
        $jwt = vapid_jwt($endpoint, $config);
        $headers = [
            'Content-Type: application/octet-stream',
            'Content-Encoding: aes128gcm',
            'TTL: 86400',
            'Urgency: high',
            'Authorization: vapid t=' . $jwt . ', k=' . $config['vapid_public_key'],
        ];
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => implode("\r\n", $headers) . "\r\n",
                'content' => $encrypted['body'],
                'timeout' => 6,
                'ignore_errors' => true,
            ],
        ]);
        $result = @file_get_contents($endpoint, false, $context);
        $statusLine = $http_response_header[0] ?? '';
        preg_match('/\s(\d{3})\s/', $statusLine, $matches);
        $status = (int) ($matches[1] ?? 0);

        if ($status >= 200 && $status < 300) {
            return ['ok' => true, 'status' => $status];
        }

        return [
            'ok' => false,
            'status' => $status,
            'expired' => in_array($status, [404, 410], true),
            'error' => $result === false ? 'Push request failed' : substr($result, 0, 500),
        ];
    } catch (Throwable $error) {
        return ['ok' => false, 'error' => $error->getMessage()];
    }
}

function push_payload(array $lead, array $config, bool $test = false): array
{
    $payload = is_array($lead['payload'] ?? null) ? $lead['payload'] : [];
    $siteUrl = rtrim((string) $config['public_site_url'], '/');
    $name = clean_string($lead['name'] ?? '') ?: 'Новый клиент';
    $cargo = clean_string($payload['cargo'] ?? '');
    $contact = clean_string($lead['phone'] ?? '') ?: (clean_string($lead['telegram'] ?? '') ?: clean_string($lead['email'] ?? ''));
    $body = $test ? 'Проверка push-уведомлений RWSCargo CRM.' : trim($name . ($cargo ? ' - ' . $cargo : '') . ($contact ? ' / ' . $contact : ''));
    $id = clean_string($lead['id'] ?? '');

    return [
        'title' => $test ? 'RWSCargo CRM: push работает' : 'Новая заявка RWSCargo',
        'body' => $body ?: 'Откройте CRM для обработки.',
        'url' => $siteUrl . '/admin/leads/' . ($id ? '#' . $id : ''),
        'tag' => $test ? 'rwscargo-push-test' : 'rwscargo-lead-' . ($id ?: time()),
    ];
}

function notify_web_push(array $lead, array $config, bool $test = false): array
{
    if (!$config['vapid_public_key'] || !$config['vapid_private_key']) {
        return ['skipped' => true, 'reason' => 'Web Push is not configured'];
    }

    $file = (string) $config['push_subscriptions_file'];
    $payload = push_payload($lead, $config, $test);

    return with_json_lock($file, function (array &$subscriptions) use ($payload, $config): array {
        $sent = 0;
        $failed = 0;
        $errors = [];

        foreach ($subscriptions as $index => &$subscription) {
            if (!is_array($subscription)) {
                unset($subscriptions[$index]);
                continue;
            }

            $result = send_web_push($subscription, $payload, $config);
            $subscription['last_status'] = $result;
            $subscription['last_sent_at'] = gmdate('c');

            if (!empty($result['ok'])) {
                $sent++;
                continue;
            }

            $failed++;
            $errors[] = $result['error'] ?? ('HTTP ' . ($result['status'] ?? 'unknown'));

            if (!empty($result['expired'])) {
                unset($subscriptions[$index]);
            }
        }

        $subscriptions = array_values($subscriptions);

        return [
            'ok' => $failed === 0,
            'sent' => $sent,
            'failed' => $failed,
            'errors' => array_slice(array_values(array_unique($errors)), 0, 3),
        ];
    });
}

function save_push_subscription(array $input, array $config): array
{
    $endpoint = clean_string($input['endpoint'] ?? '');
    $keys = is_array($input['keys'] ?? null) ? $input['keys'] : [];

    if ($endpoint === '' || empty($keys['p256dh']) || empty($keys['auth'])) {
        return ['ok' => false, 'error' => 'Invalid push subscription'];
    }

    return with_json_lock((string) $config['push_subscriptions_file'], function (array &$subscriptions) use ($input, $endpoint): array {
        $stored = [
            'endpoint' => $endpoint,
            'expirationTime' => $input['expirationTime'] ?? null,
            'keys' => [
                'p256dh' => (string) $input['keys']['p256dh'],
                'auth' => (string) $input['keys']['auth'],
            ],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'updated_at' => gmdate('c'),
        ];

        foreach ($subscriptions as &$subscription) {
            if (($subscription['endpoint'] ?? '') === $endpoint) {
                $subscription = array_merge($subscription, $stored);

                return ['ok' => true, 'created' => false, 'count' => count($subscriptions)];
            }
        }

        $stored['created_at'] = gmdate('c');
        array_unshift($subscriptions, $stored);

        return ['ok' => true, 'created' => true, 'count' => count($subscriptions)];
    });
}

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = preg_replace('#^/api(?=/|$)#', '', $path);
    $path = $path === '' ? '/' : (rtrim($path, '/') ?: '/');

    if ($method === 'OPTIONS') {
        http_response_code(204);
        header('Access-Control-Allow-Methods: GET,POST,PATCH,DELETE,OPTIONS');
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
        $lead['notification_status']['email'] = notify_email($lead, $config);
        $lead['notification_status']['push'] = notify_web_push($lead, $config);
        with_leads_lock((string) $config['data_file'], function (array &$leads) use ($lead): void {
            array_unshift($leads, $lead);
        });
        send_json(201, ['ok' => true, 'id' => $lead['id'], 'notificationStatus' => $lead['notification_status']]);
        exit;
    }

    if ($method === 'GET' && $path === '/push/config') {
        if (!has_admin_access($config)) {
            send_json(401, ['ok' => false, 'error' => 'Unauthorized']);
            exit;
        }

        send_json(200, [
            'ok' => true,
            'enabled' => (bool) ($config['vapid_public_key'] && $config['vapid_private_key']),
            'publicKey' => (string) $config['vapid_public_key'],
        ]);
        exit;
    }

    if ($method === 'POST' && $path === '/push/subscriptions') {
        if (!has_admin_access($config)) {
            send_json(401, ['ok' => false, 'error' => 'Unauthorized']);
            exit;
        }

        $result = save_push_subscription(read_json_body(), $config);
        send_json(!empty($result['ok']) ? 201 : 422, $result);
        exit;
    }

    if ($method === 'POST' && $path === '/push/test') {
        if (!has_admin_access($config)) {
            send_json(401, ['ok' => false, 'error' => 'Unauthorized']);
            exit;
        }

        $testLead = [
            'id' => 'test-' . bin2hex(random_bytes(4)),
            'name' => 'Тест CRM',
            'payload' => ['cargo' => 'проверка уведомлений'],
        ];
        send_json(200, ['ok' => true, 'push' => notify_web_push($testLead, $config, true)]);
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
