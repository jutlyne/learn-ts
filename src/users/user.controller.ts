import bcrypt from 'bcrypt';
import { User } from '.';
import { Request, Response } from 'express';

export class userController {
  async login(req: Request, res: Response) {
    const error = req.flash().error || [];

    res.render('auth/login', {
      layout: 'auth',
      error: error
    });
  }

  async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect('/');
    });
  }

  async formRegister(req: Request, res: Response) {
    const error = req.flash().error || [];

    res.render('auth/register', {
      layout: 'auth',
      error: error,
    });
  }

  async register(req: Request, res: Response) {
    const query = { username: req.body?.username };

    const user = (await User.find(query)) as any;

    if (user) {
      req.flash('error', 'User already exists!');

      return res.redirect('/register');
    }

    const saltRounds = 10;
    const myPlaintextPassword = req.body.password;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt);
    const newUser = new User({
      username: req.body?.username,
      password: passwordHash
    });

    const result = await newUser.save();
    console.log(result);

    result
      ? res.redirect('/login')
      : res.redirect('/register')
  }

  async homePage(req: Request, res: Response) {
    return res.render('home')
  }
}
