import itemSchema from '../models/items';
import { API_PREFIX } from '../config';

export default router => {

  router.prefix(`${API_PREFIX}/items`);

  router.get('/', async (ctx) => {
    ctx.body = await itemSchema.find();
  });

  router.post('/', async (ctx) => {
    const item = (ctx.request.body.title) ? ctx.request.body.title.trim() : '';
    if (item) {
      ctx.body = await new itemSchema({ title: 'test', time: new Date() }).save();
    } else {
      ctx.response.status = 400;
      ctx.body = { error: 'Validation error' };
    }
  });

  // router.put('/', async (ctx) => {
  //   const item = (ctx.request.body.title) ? ctx.request.body.title.trim() : '';
  //   ctx.body = 'success bitch';
  // });

  // router.delete('/:id', async (ctx) => {
  //   ctx.body = ctx.params.id;
  //   // ctx.body = await itemSchema.findByIdAndRemove(ctx.params.id);
  //   // ctx.body = 'success bitch';
  // });

  return router;

}
