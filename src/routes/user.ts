import { Router, Request, Response } from 'express';
import multer from 'multer';
import { login as validationLogin } from '../validator';
import passport from 'passport';
import { userController } from '../users';
import { ensureLoggedIn, ensureLoggedOut } from 'connect-ensure-login'

export default class apiRoutes {
  public router: Router;

  private controller: userController = new userController();
  private formData = multer();

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    this.router.get('/', this.formData.none(), this.controller.homePage);
    this.router.get('/login', ensureLoggedOut(), this.controller.login);
    this.router.get('/register', ensureLoggedOut(), this.controller.formRegister);
    this.router.post(
      '/login',
      this.formData.none(),
      validationLogin,
      passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/',
        failureFlash: true,
      }),
      (req: Request, res: Response) => {}
    );
    this.router.post(
      '/register',
      this.formData.none(),
      validationLogin,
      this.controller.register
    )
    this.router.get('/logout', ensureLoggedIn(), this.controller.logout);
  }
}
