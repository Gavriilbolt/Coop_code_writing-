const express = require('express');
const app = express();


const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);




const fs = require('fs');
const bodyParser = require('body-parser');
const urlencodedParser = express.urlencoded({extended: false});


const cookieParser = require('cookie-parser');


const jsdom = require("jsdom");
const { JSDOM } = jsdom;

app.use(cookieParser());


console.log('Hello, world!');
app.use(bodyParser.json());



app.get('/', (req, res) => {	
	const name = req.cookies.userIsLogged; // печенье в переменной
	new_main = mainAtorizationState(name);
    res.send(new_main);
    //запекаем пробное печенье 
    //console.log(name); // выводим печенье в консоль  
});

io.on('connection', (socket) => {
  console.log('a user connected');
});



app.get('/registration', (req, res) => {
  res.sendFile(__dirname + '/registration.html');
});


app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});


app.get('/logout', (req, res) => {
	userLogOut(req, res);
	res.send('Вы вышли из системы<br><a href="/">Главная странца</a><br><a href="/registration">Регистрация</a>')
});


// ***Регистрация нового пользователя ***
app.post('/registration', urlencodedParser, (req, res) => {
  // Проверяем, что обязательные поля заполнены
  //console.log(req.body);
  if (!req.body) {
	return res.status(400).send('Username and password are required <br><a href="/">Главная странца</a>');
  }

  if (req.body.username == "" || req.body.password == "") {
    return res.status(400).send('Username and password are required <br><a href="/">Главная странца</a>');
	//console.log(req.body.username);
	//console.log(req.body.password);
  }

  // Проверяем, что пользователь с таким именем не существует
  const users = getUsers();
  if (users.find(u => u.username === req.body.username)) {
    return res.status(409).send('User with such username already exists <br><a href="/">Главная странца</a>');
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
  res.status(201).send('User registered <br><a href="/">Главная странца</a>');
});
// ***Регистрация нового пользователя ***


// *** Вход пользователя ***
app.post('/login', urlencodedParser, (req, res) => {
	console.log(req.body);
	if (!req.body) {
	return res.status(400).send('Username and password are required <br><a href="/">Главная странца</a>');
  }
	if (req.body.username == "" || req.body.password == "") {
    return res.status(400).send('Не введено имя пользователя или пароль <br><a href="/">Главная странца</a>');
	//console.log(req.body.username);
	//console.log(req.body.password);
  }
  const users = getUsers(); // хаваем users.json
	//console.log(users);
    if (users.find(u => u.username === req.body.username && u.password === req.body.password)) { // теперь нужно проверить имя пользователя и пароль 
	// здесь нужно сохранить сосотояние в печеньках
	res.cookie('userIsLogged', req.body.username);
	const userIsLogged = req.cookies.userIsLogged; // печенье в переменной 
	//console.log(userIsLogged) // выводим печенье в консоль  
	return res.status(409).send(`Добро пожаловать, ${req.body.username} <br><a href="/">Главная страница</a>`);
  } else {
	// код, который будет выполнен, если все предыдущие условия ложны
	return res.status(400).send('Такго пользователя не существует <br><a href="/">Главная странца</a><br><a href="/registration">Регистрация</a>');
	}
});
// *** Вход пользователя ***


// Получение списка всех пользователей функции для регистрации пользователей
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


// обновление информации об авторизации на главной странице
function mainAtorizationState(name){
	const html = fs.readFileSync(__dirname + '/main.html', "utf8");
	const dom = new JSDOM(html);
	if (name == undefined){
	dom.window.document.getElementById("authorization").innerHTML = "ВХОД НЕ ВЫПОЛНЕН";
	}
	else{
	dom.window.document.getElementById("authorization").innerHTML = `ВХОД ВЫПОЛНЕН (${name})`;
	}
	
	return dom.serialize()
}


function userLogOut(req, res){
	console.log("salam")
	res.clearCookie('userIsLogged');
	
}

// Запускаем сервер на порту 3000
app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
