import crypto from 'crypto';
import mongoose from 'mongoose';
import { userModel } from '../models';
import { API_PREFIX } from '../config';

export default router => {

  const prefix = `${API_PREFIX}/users`;

  router.get(prefix, async (ctx) => {
    try {
      ctx.body = await userModel.find();
    }
    catch(err) {
      console.log(err);
      ctx.status = err.status || 500;
      ctx.body = 'Internal server error';
    }
  });

  router.get(`${prefix}/:id`, async (ctx) => {
    ctx.body = '';
    if (mongoose.Types.ObjectId.isValid(ctx.params.id)) {
      try {
        ctx.body = await userModel.findById(ctx.params.id);
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

  router.post(prefix, async (ctx) => {
    const login = (ctx.request.body.login) ? ctx.request.body.login.trim() : '';
    const password = (ctx.request.body.password) ? ctx.request.body.password.trim() : '';
    if (login && password) {
      const hash = crypto.createHash('md5').update(password).digest('hex');
      try {
        ctx.body = await new userModel({ login, password: hash, time: new Date() }).save();
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

  router.put(`${prefix}/:id`, async (ctx) => {
    ctx.body = '';
    ctx.request.body.login = (ctx.request.body.login) ? ctx.request.body.login.trim() : '';
    ctx.request.body.password = (ctx.request.body.password) ? ctx.request.body.password.trim() : '';
    if (ctx.request.body.login && ctx.request.body.password) {
      ctx.request.body.password = crypto.createHash('md5').update(ctx.request.body.password).digest('hex');
      if (mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.request.body.time = new Date();
        try {
          ctx.body = await userModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
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

  router.delete(`${prefix}/:id`, async (ctx) => {
    ctx.body = '';
    if (mongoose.Types.ObjectId.isValid(ctx.params.id)) {
      try {
        ctx.body = await userModel.findByIdAndRemove(ctx.params.id);
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
