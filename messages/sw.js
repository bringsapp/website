self.addEventListener('push', event => {
    console.log('[Service Worker] Push Received with data.');

    let pushData = event.data.json()
    const title = pushData.Title;
    const options = {
      body: pushData.Msg,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  });