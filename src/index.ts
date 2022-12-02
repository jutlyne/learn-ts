import path from 'path';
import cors from 'cors';
import routes from './App';
import express from 'express';
import passport from 'passport';
import flash from 'connect-flash';
import { AddressInfo } from 'net';
import { createServer } from 'http';
import * as socketio from 'socket.io';
import { engine } from 'express-handlebars';
import { initPassport, middleware } from './app/authenticate';
import { corsOptions, redisSession, connectToDatabase } from './config';
import { socketManager } from './listeners/socket';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  async config(): Promise<void> {
    const port = process.env.PORT || 3000;

    // config redis session
    await redisSession(this.app);

    // config passport
    this.app.use(passport.initialize())
    this.app.use(passport.session())

    this.app.set('port', port);
    this.app.use(cors(corsOptions));

    // config body parse using express
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // setting the view engine
    this.app.engine('.hbs', engine({
      extname: '.hbs',
      partialsDir: path.join(__dirname, 'resources/views/layouts/partials'),
    }));

    this.app.set('view engine', '.hbs');
    // setting for the root path for views directory
    this.app.set('views', path.join(__dirname, 'resources/views'));

    this.app.use(flash());
    this.app.use(express.static(path.join(__dirname, 'public')));

    // middleware user
    // const allowUrl: any = new Array('/home');
    // this.app.use(middleware(allowUrl));

    // add route
    routes(this.app);

    // init passport
    initPassport();
  }

  public start(): void {
    connectToDatabase()
      .then(() => {
        const server = createServer(this.app);
        global.io = new socketio.Server(server, {
          cors: corsOptions,
        });

        socketManager(global.io);

        server.listen(this.app.get('port'), () => {
          const { port } = server.address() as AddressInfo;

          console.log(`Server listening in port ${port}`);
        });
      })
  }
}

const server = new Server();
server.start();
