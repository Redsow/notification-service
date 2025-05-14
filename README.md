```markdown
#  Notification Service (gRPC + Node.js + MySQL)

**Notification Service** — микросервис для отправки уведомлений по различным каналам с возможностью отслеживания их статуса через gRPC.

---

## Используемые технологии

- **Node.js** — среда выполнения JavaScript
- **gRPC** — высокопроизводительное RPC API
- **MySQL** — база данных
- **Sequelize** — ORM для Node.js
- **uuid** — генерация уникальных идентификаторов

---

##  Структура проекта



---

##  Установка и запуск

### 1. Клонирование и установка зависимостей

```bash
git clone https://github.com/yourname/notification-service.git
cd notification-service
npm install
````

### 2. Создание базы данных

Подключись к MySQL и создай базу:

```sql
CREATE DATABASE notifications_db;
```

### 3. Настройка доступа к MySQL

Открой `db.js` и укажи свои данные:

```js
const sequelize = new Sequelize('notifications_db', 'your_user', 'your_password', {
  host: 'localhost',
  dialect: 'mysql',
});
```

---

## Запуск сервиса

### 1. gRPC сервер

```bash
node server.js
```

Успешный запуск:

```
 MySQL connected & synced
 gRPC server is running on port 50051
```

### 2. gRPC клиент

```bash
node client.js
```

Ожидаемый результат:

* Уведомление отправлено
* Обновление статуса через стрим
* Получен текущий статус
* Список уведомлений

---

## API gRPC (из `notification.proto`)

| Метод                    | Тип           | Описание                               |
| ------------------------ | ------------- | -------------------------------------- |
| `SendNotification`       | unary         | Отправка уведомления                   |
| `GetNotificationStatus`  | unary         | Получение текущего статуса уведомления |
| `ListNotifications`      | unary         | Список всех уведомлений                |
| `SubscribeStatusUpdates` | server-stream | Подписка на обновления статуса         |

---

## Проверка через MySQL

Подключись к базе и выполни:

```sql
USE notifications_db;
SELECT * FROM notifications;
```

---

## Пример уведомления в базе

| id                                   | target                                      | type  | payload | status    |
| ------------------------------------ | ------------------------------------------- | ----- | ------- | --------- |
| 409ab4ec-f89f-4b7a-8fcf-7e12c5e2c28b | [user@example.com](mailto:user@example.com) | email | Привет! | DELIVERED |
