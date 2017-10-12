export function askNotificationPermission() {
  return new Promise((resolve, reject) => {
    Notification.requestPermission((result) => {
      if (result !== 'granted') {
        return reject(Error('Denied notification permission'));
      }

      resolve(true);
    });
  });
}
