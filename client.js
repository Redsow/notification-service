const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, './proto/notification.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).notification;

const client = new proto.NotificationService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);


client.SendNotification(
  { target: 'user@example.com', type: 'email', payload: 'Привет!' },
  (err, res) => {
    if (err) return console.error('Ошибка отправки:', err);
    console.log('Уведомление отправлено:', res);

    const id = res.id;

    const stream = client.SubscribeStatusUpdates({ id });
    stream.on('data', update => console.log('Обновление статуса:', update));
    stream.on('end', () => console.log('Подписка завершена'));

    setTimeout(() => {
      client.GetNotificationStatus({ id }, (err, res) => {
        if (err) return console.error('Ошибка статуса:', err);
        console.log('Текущий статус:', res);
      });
    }, 1000);

    setTimeout(() => {
      client.ListNotifications({}, (err, res) => {
        if (err) return console.error('Ошибка списка:', err);
        console.log('Список уведомлений:', res.notifications);
      });
    }, 2500);
  }
);
