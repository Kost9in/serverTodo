import mongoose from 'mongoose';
import itemSchema from '../models';
import { API_PREFIX } from '../config';

export default router => {

  router.prefix(`${API_PREFIX}/items`);

  router.get('/', async (ctx) => {
    try {
      ctx.body = await itemSchema.find();
    }
    catch(err) {
      ctx.status = err.status || 500; 
      ctx.body = 'Internal server error';
    }
  });

  router.get('/:id', async (ctx) => {
    ctx.body = '';
    if (mongoose.Types.ObjectId.isValid(ctx.params.id)) {
      try {
        ctx.body = await itemSchema.findById(ctx.params.id);
      }
      catch(err) {
        ctx.status = err.status || 500; 
        ctx.body = 'Internal server error';
      }
    }
    if (!ctx.body) {
      ctx.response.status = 404;
      ctx.body = { error: 'Not found' };
    }
  });

  router.post('/', async (ctx) => {
    const item = (ctx.request.body.title) ? ctx.request.body.title.trim() : '';
    if (item) {
      try {
        ctx.body = await new itemSchema({ title: 'test', time: new Date() }).save();
      }
      catch(err) {
        ctx.status = err.status || 500; 
        ctx.body = 'Internal server error';
      }
    } else {
      ctx.response.status = 400;
      ctx.body = { error: 'Validation error' };
    }
  });

  router.put('/:id', async (ctx) => {
    ctx.body = '';
    ctx.request.body.title = (ctx.request.body.title) ? ctx.request.body.title.trim() : '';
    if (ctx.request.body.title) {
      if (mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.request.body.time = new Date();
        try {
          ctx.body = await itemSchema.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        }
        catch(err) {
          ctx.status = err.status || 500; 
          ctx.body = 'Internal server error';
        }
      }
      if (!ctx.body) {
        ctx.response.status = 404;
        ctx.body = { error: 'Not found' };
      }
    } else {
      ctx.response.status = 400;
      ctx.body = { error: 'Validation error' };
    }
  });

  router.delete('/:id', async (ctx) => {
    ctx.body = '';
    if (mongoose.Types.ObjectId.isValid(ctx.params.id)) {
      try {
        ctx.body = await itemSchema.findByIdAndRemove(ctx.params.id);
      }
      catch(err) {
        ctx.status = err.status || 500; 
        ctx.body = 'Internal server error';
      }
    }
    if (!ctx.body) {
      ctx.response.status = 404;
      ctx.body = { error: 'Not found' };
    }
  });

  return router;

}
