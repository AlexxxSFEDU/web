const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/', movieController.getAllMovies);
router.post('/', movieController.createMovie);

router.get('/:id/edit', movieController.getEditMovie);
router.post('/:id/update', movieController.updateMovie);

router.get('/:id/delete', movieController.deleteMovie);

module.exports = router;