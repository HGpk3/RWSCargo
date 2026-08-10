const DEFAULT_URL = "/admin/leads/";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {
      title: "Новая заявка RWSCargo",
      body: event.data ? event.data.text() : "Откройте CRM для обработки.",
    };
  }

  const title = payload.title || "Новая заявка RWSCargo";
  const url = payload.url || DEFAULT_URL;
  const options = {
    body: payload.body || "Откройте CRM для обработки.",
    icon: "/apple-touch-icon.png",
    badge: "/favicon-32.png",
    tag: payload.tag || "rwscargo-lead",
    renotify: true,
    data: { url },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || DEFAULT_URL, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client && client.url.startsWith(self.location.origin)) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      return self.clients.openWindow(targetUrl);
    }),
  );
});
