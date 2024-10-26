const express = require('express');
const { Pool } = require('pg');
const { Liquid } = require('liquidjs');

const app = express();
const port = 3000;
const pool = new Pool({
   connectionString: 'postgresql://postgres:1597@localhost:5432/movies'
});

const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './views');
app.set('view engine', 'liquid');

app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
   const { rows } = await pool.query('SELECT * FROM movies');
   res.render('index', { movies: rows });
});

app.get('/add-movie', (req, res) => {
   res.render('add-movie');
});

app.post('/add-movie', async (req, res) => {
   const { title } = req.body;
   await pool.query('INSERT INTO movies(title) VALUES($1)', [title]);
   res.redirect('/');
});

app.get('/update-movie/:id', async (req, res) => {
   const { id } = req.params;
   const { rows } = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
   res.render('update-movie', { movie: rows[0] });
});

app.post('/update-movie/:id', async (req, res) => {
   const { title } = req.body;
   const { id } = req.params;
   await pool.query('UPDATE movies SET title = $1 WHERE id = $2', [title, id]);
   res.redirect('/');
});

app.post('/delete-movie/:id', async (req, res) => {
   const { id } = req.params;
   await pool.query('DELETE FROM movies WHERE id = $1', [id]);
   res.redirect('/');
});

app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`);
});