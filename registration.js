const express = require('express');
const app = express();
const fs = require('fs');

const bodyParser = require('body-parser');
console.log('Hello, world!');
app.use(bodyParser.json());

const urlencodedParser = express.urlencoded({extended: false});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/main.html');
});
app.get('/registration', (req, res) => {
  res.sendFile(__dirname + '/registration.html');
});

// Регистрация нового пользователя
app.post('/registration', urlencodedParser, (req, res) => {
  // Проверяем, что обязательные поля заполнены
  console.log(req.body);
  if (!req.body) {
	return res.status(400).send('Username and password are required');
  }

  if (req.body.username == "" || req.body.password == "") {
    return res.status(400).send('Username and password are required');
	console.log(req.body.username);
	console.log(req.body.password);
  }

  // Проверяем, что пользователь с таким именем не существует
  const users = getUsers();
  if (users.find(u => u.username === req.body.username)) {
    return res.status(409).send('User with such username already exists');
  }

  // Создаем нового пользователя
  const newUser = {
    username: req.body.username,
    password: req.body.password
  };
  users.push(newUser);

  // Сохраняем пользователей в файл
  saveUsers(users);

  // Возвращаем успешный ответ
  res.status(201).send('User registered');


});

// Получение списка всех пользователей
app.get('/users', (req, res) => {
  const users = getUsers();
  res.json(users);
});

// Загрузка пользователей из файла
function getUsers() {
  try {
    const data = fs.readFileSync('users.json');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Сохранение пользователей в файл
function saveUsers(users) {
  const data = JSON.stringify(users, null, 2);
  fs.writeFileSync('users.json', data);
}

// Запускаем сервер на порту 3000




app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
