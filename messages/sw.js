self.addEventListener('push', event => {
    console.log('[Service Worker] Push Received with data.');

    let pushData = event.data.json()
    const title = pushData.Title;
    const options = {
      body: pushData.Msg,
      tag: "messages"
    };

    event.waitUntil(self.registration.showNotification(title, options));
  });


self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == '/' && 'focus' in client)
            return client.focus();
        }
        if (clients.openWindow) {
          return clients.openWindow('https://bringsapp.com/messages');
        }
      })
  );
});
