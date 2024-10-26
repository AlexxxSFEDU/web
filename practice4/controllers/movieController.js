const Movie = require('../models/Movie');

exports.getAllMovies = async (req, res) => {
   try {
      const movies = await Movie.getAllByUserId(req.user.id, req.app.locals.pool);
      res.render('index', { movies });
   } catch (err) {
      console.error('Error getting movies:', err);
      res.status(500).send('Error getting movies');
   }
};

exports.createMovie = async (req, res) => {
   try {
      const { title } = req.body;
      const movie = await Movie.create(title, req.user.id, req.app.locals.pool);
      res.redirect('/movies');
   } catch (err) {
      console.error('Error creating movie:', err);
      res.status(500).send('Error creating movie');
   }
};

exports.getEditMovie = async (req, res) => {
   try {
      const movie = await Movie.getById(req.params.id, req.app.locals.pool);
      res.render('edit', { movie });
   } catch (err) {
      console.error('Error getting movie:', err);
      res.status(500).send('Error getting movie');
   }
};

exports.updateMovie = async (req, res) => {
   try {
      const { title } = req.body;
      const movie = await Movie.update(req.params.id, title, req.app.locals.pool);
      res.redirect('/movies');
   } catch (err) {
      console.error('Error updating movie:', err);
      res.status(500).send('Error updating movie');
   }
};

exports.deleteMovie = async (req, res) => {
   try {
      await Movie.delete(req.params.id, req.app.locals.pool);
      res.redirect('/movies');
   } catch (err) {
      console.error('Error deleting movie:', err);
      res.status(500).send('Error deleting movie');
   }
};