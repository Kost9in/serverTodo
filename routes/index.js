import itemsRouter from './items';
import authRouter from './auth';
import usersRouter from './users';

export default router => {
  router = itemsRouter(router);
  router = authRouter(router);
  router = usersRouter(router);
  return router;
}
