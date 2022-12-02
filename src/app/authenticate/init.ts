import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../../users/index';
import { mongooseToOject } from '../../util';

function findUser (username: any, callback: any) {
  User.findOne({ username: username })
    .exec(function (err, user) {
      if (user) {
        return callback(null, user)
      };

      return callback(null)
    });
}

passport.serializeUser(function (user: any, done) {
  done(null, user?.username)
})

passport.deserializeUser(function (username, cb) {
  findUser(username, cb)
})

function initPassport () {
  passport.use(new Strategy({
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      findUser(username, (err: any, user: any) => {
        if (err) {
          return done(err)
        }

        if (!user) {
          return done(null, false, { message: 'User not found' })
        }

        bcrypt.compare(password, user.password, (err, isValid) => {
          if (err) {
            return done(err)
          }

          if (!isValid) {
            return done(null, false, { message: 'Incorrect password' })
          }

          return done(null, user)
        })
      })
    }
  ))
}

export default initPassport;
