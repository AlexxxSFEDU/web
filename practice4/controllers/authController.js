const passport = require('passport');
const User = require('../models/User');

exports.getLoginPage = (req, res) => {
   res.render('auth/login');
};

exports.login = passport.authenticate('local', {
   successRedirect: '/movies',
   failureRedirect: '/auth/login',
});

exports.getRegisterPage = (req, res) => {
   res.render('auth/register');
};

exports.register = async (req, res) => {
   try {
      const { username, password } = req.body;
      const user = await User.create(username, password, req.app.locals.pool);
      req.login(user, (err) => {
         if (err) throw err;
         res.redirect('/movies');
      });
   } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).send('Error registering user');
   }
};

exports.logout = (req, res) => {
   req.logout();
   res.redirect('/auth/login');
};