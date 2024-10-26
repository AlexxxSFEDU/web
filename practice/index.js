const express = require('express');
const { Liquid } = require('liquidjs');
const fs = require('fs');
const path = require('path');

const app = express();
const engine = new Liquid({
   extname: '.liquid',
   root: path.join(__dirname, 'views'),
   strict_filters: true,
   strict_variables: true
});

app.engine('liquid', engine.express());
app.set('view engine', 'liquid');

app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
   console.log('Сервер запущен на http://localhost:3000');
});
//локально
function loadQuestions() {
   const questions = fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf-8');
   return JSON.parse(questions);
}

function loadAnswers() {
   const answers = fs.readFileSync(path.join(__dirname, 'answers.json'), 'utf-8');
   return JSON.parse(answers);
}
//сервер
/* async function loadQuestions() {
   const response = await axios.get('api');
   return response.data;
 }

 async function loadAnswers() {
   const response = await axios.get('api');
   return response.data;
 } */
let results = [];

app.get('/', (req, res) => {
   const questions = loadQuestions();
   res.render('form', { questions });
});
// локально
app.post('/submit', (req, res) => {
   const name = req.body.name;
   const userAnswers = Object.values(req.body).slice(1);
   const correctAnswers = loadAnswers();
   let score = 0;

   for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] === correctAnswers[i]) {
         score++;
      }
   }

   results.push({ name, score });

   res.render('result', { name, score, total: correctAnswers.length });
});
//сервер
/* async function saveResults(results) {
   await axios.post('api', results);
}

app.post('/submit', async (req, res) => {
   await saveResults([{ name, score }]);
}); */

app.get('/leaderboard', (req, res) => {
   res.render('leaderboard', { results });
});