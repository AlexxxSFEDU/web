const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

// Настройка стратегии аутентификации
passport.use(new LocalStrategy(
   async (username, password, done) => {
      try {
         const user = await User.findByUsername(username, req.app.locals.pool);
         if (!user || !user.verifyPassword(password)) {
            return done(null, false, { message: 'Неверные учетные данные' });
         }
         return done(null, user);
      } catch (err) {
         return done(err);
      }
   }
));

// Сериализация и десериализация пользователя
passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
   try {
      const user = await User.findById(id, req.app.locals.pool);
      done(null, user);
   } catch (err) {
      done(err);
   }
});

module.exports = passport;