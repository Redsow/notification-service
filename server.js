const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const sequelize = require('./db');
const Notification = require('./models/notification');

const PROTO_PATH = path.join(__dirname, './proto/notification.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).notification;

const subscribers = new Map();

async function SendNotification(call, callback) {
  const id = uuidv4();
  const notifData = {
    id,
    target: call.request.target,
    type: call.request.type,
    payload: call.request.payload,
    status: 'SENT',
  };

  await Notification.create(notifData);
  callback(null, { id, status: 'SENT' });

  setTimeout(async () => {
    await Notification.update({ status: 'DELIVERED' }, { where: { id } });
    if (subscribers.has(id)) {
      subscribers.get(id).forEach(stream => {
        stream.write({ id, status: 'DELIVERED' });
        stream.end();
      });
      subscribers.delete(id);
    }
  }, 2000);
}

async function GetNotificationStatus(call, callback) {
  const notif = await Notification.findByPk(call.request.id);
  if (!notif) return callback(new Error('Not found'));
  callback(null, { id: notif.id, status: notif.status });
}

async function ListNotifications(_, callback) {
  const all = await Notification.findAll();
  callback(null, { notifications: all.map(n => n.toJSON()) });
}

function SubscribeStatusUpdates(call) {
  const id = call.request.id;
  if (!subscribers.has(id)) {
    subscribers.set(id, []);
  }
  subscribers.get(id).push(call);
}

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('MySQL connected & synced');

    const server = new grpc.Server();
    server.addService(proto.NotificationService.service, {
      SendNotification,
      GetNotificationStatus,
      ListNotifications,
      SubscribeStatusUpdates,
    });

    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
      console.log('gRPC server is running');
      server.start();
    });
  } catch (error) {
    console.error('MySQL connection error:', error);
  }
}

main();
