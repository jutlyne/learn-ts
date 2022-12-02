import 'dotenv/config'
import { Application } from 'express';
import userRoutes from './routes/user';

const routes = (server:Application): void => {
  server.use('/', new userRoutes().router)
}

export default routes
