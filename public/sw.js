self.addEventListener("install", (e) => {
    console.log("Service Worker installed.");
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (e) => {
    console.log("Service Worker activated.");
  });
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        if (clientList.length > 0) {
          clientList[0].focus();
        } else {
          clients.openWindow("/");
        }
      })
    );
  });
  