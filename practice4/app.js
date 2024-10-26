const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
   secret: 'your-secret-key',
   resave: false,
   saveUninitialized: true
}));
const liquid = require('liquid-express-views');
const { Pool } = require('pg');
const passport = require('./auth');

const port = 3000;

const isAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect('/auth/login');
};

// Настройка Liquid шаблонизатора
app.engine('liquid', (path, options, callback) => {
   liquidEngine(path, options, callback);
});
app.set('view engine', 'liquid');
app.set('views', './views');


// Настройка подключения к PostgreSQL
const pool = new Pool({
   user: 'postgres',
   host: 'localhost',
   database: 'movie_catalog',
   password: '1597',
   port: 5432,
});

// Настройка Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Определение маршрутов
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/movies', isAuthenticated, movieRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
   res.redirect('/movies');
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});

// Middleware для проверки авторизации