import Koa from 'koa';
import cors from 'kcors';
import koaRouter from 'koa-router';
import koaLogger from 'koa-logger';
import koaParser from 'koa-bodyparser';
import jwt from 'koa-jwt';
import mongoose from 'mongoose';
import { HOST, PORT, DB_CONNECT, API_PREFIX, JWT_SECRET_STRING } from './config';
import routes from './routes';

mongoose.connect(DB_CONNECT);
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => console.log('Connected to DB!'));

const router = routes(koaRouter());

const app = new Koa();

app
  .use(cors())
  .use(koaLogger())
  .use(koaParser())
  .use(jwt({ secret: JWT_SECRET_STRING }).unless({ path: [`${API_PREFIX}/auth/login`] }))
  .use(router.routes());

app.listen(PORT, HOST, () => console.log(`server started: http://${HOST}:${PORT}`));

export default app;
