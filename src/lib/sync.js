import storage from 'localforage';

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

export async function queue(name, payload) {
  const items = await storage.getItem(name);
  const queues = items || [];
  const exists = queues.find(item => item.recipeId === payload.recipeId);

  if (!exists) {
    queues.push(payload);
  }

  return storage.setItem(name, queues);
}
