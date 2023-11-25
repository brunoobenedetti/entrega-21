import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { createHash, isValidPassword } from '../utils.js';
import UserModel from '../dao/models/user.model.js';

const opts = {
  usernameField: 'email',
  passReqToCallback: true,
};

const githubOpts = {
  clientID: 'Iv1.14a8ed194f9246fa', 
  clientSecret: '635901ff44c3d85d0d2eca5c4561d0b5f156f055',
  callbackURL: "http://localhost:8080/api/sessions/github/callback", 
};
export const init = () => {
  passport.use('register', new LocalStrategy(opts, async (req, email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        return done(new Error('User already register 😨'));
      }
      const newUser = await UserModel.create({
        ...req.body,
        password: createHash(password),
      });
      done(null, newUser);
    } catch (error) {
      done(new Error(`Ocurrio un error durante la autenticacion ${error.message} 😨.`));
    }
  }));

  passport.use('login', new LocalStrategy(opts, async (req, email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return done(new Error('Correo o contraseña invalidos 😨'));
      }
      const isPassValid = isValidPassword(password, user);
      if (!isPassValid) {
        return done(new Error('Correo o contraseña invalidos 😨'));
      }
      done(null, user);
    } catch (error) {
      done(new Error(`Ocurrio un error durante la autenticacion ${error.message} 😨.`));
    }
  }));

  passport.use('github', new GithubStrategy(githubOpts, async (accessToken, refreshToken, profile, done) => {
    console.log('profile', profile);
    const email = profile._json.email;
    let user = await UserModel.findOne({ email });
    if (user) {
      return done(null, user);
    }
    user = {
      first_name: profile._json.name,
      last_name: '',
      email,
      age: 18,
      password: '',
      provider: 'Github',
    };

    const newUser = await UserModel.create(user);
    done(null, newUser);
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (uid, done) => {
    const user = await UserModel.findById(uid);
    done(null, user);
  });
}