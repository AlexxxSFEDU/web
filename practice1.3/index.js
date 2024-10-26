const express = require('express');
const session = require('express-session');
const { Liquid } = require('liquidjs');
const path = require('path');

const app = express();
const port = 3000;

// Загрузка данных пользователей из файла
const users = require('./users.json');

app.use(session({
   secret: 'your-secret-key',
   resave: false,
   saveUninitialized: true
}));

const engine = new Liquid({
   root: path.join(__dirname, 'views'),
   extname: '.liquid'
});
app.engine('liquid', engine.express());
app.set('view engine', 'liquid');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

// Маршруты
app.get('/', (req, res) => {
   res.render('login', { message: req.session.message });
   req.session.message = null; 
});

app.post('/login', (req, res) => {
   const { username, password } = req.body;
   const user = users.find(u => u.username === username && u.password === password);

   if (user) {
      // Авторизация пользователя
      req.session.user = user;
      res.redirect('/profile');
   } else {
      req.session.message = 'Неверный логин или пароль';
      res.redirect('/');
   }
});

app.get('/profile', isLoggedIn, (req, res) => {
   res.render('profile', { user: req.session.user });
});

app.get('/users', isAdmin, (req, res) => {
   res.render('users', { users: users });
});

app.get('/logout', (req, res) => {
   req.session.destroy();
   res.redirect('/');
});

app.get('/no-access', (req, res) => {
   res.render('no-access');
});

function isLoggedIn(req, res, next) {
   if (req.session.user) return next();
   res.redirect('/no-access');
}

function isAdmin(req, res, next) {
   if (req.session.user && req.session.user.role === 'admin') return next();
   res.redirect('/no-access');
}

app.listen(port, () => {
   console.log(`Сервер запущен на порту ${port}`);
});
