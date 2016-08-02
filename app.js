import Koa from 'koa';
import koaRouter from 'koa-router';
import koaLogger from 'koa-logger';
import koaParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import { HOST, PORT, DB_CONNECT } from './config';
import routes from './routes';

mongoose.connect(DB_CONNECT);
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => console.log('Connected to DB!'));

const router = routes(koaRouter());

const app = new Koa();

app
  .use(koaLogger())
  .use(koaParser())
  .use(router.routes());

app.listen(PORT, HOST, () => console.log(`server started: http://${HOST}:${PORT}`));

export default app;
