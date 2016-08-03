import jwt from 'koa-jwt';
import crypto from 'crypto';
import { userModel } from '../models';
import { API_PREFIX, JWT_SECRET_STRING } from '../config';

export default router => {

    const prefix = `${API_PREFIX}/auth`;

    router.post(`${prefix}/login`, async (ctx) => {
      const login = (ctx.request.body.login) ? ctx.request.body.login.trim() : '';
      const password = (ctx.request.body.password) ? ctx.request.body.password.trim() : '';
      const hash = crypto.createHash('md5').update(password).digest('hex');
      let user;
      try {
        user = await userModel.findOne({ login, password: hash });
      }
      catch(err) {
        ctx.status = err.status || 500;
        ctx.body = 'Internal server error';
      }
      if (user) {
        const token = jwt.sign({ login: user.login }, JWT_SECRET_STRING);
        ctx.body = { token };
      } else {
        ctx.status = 401;
        ctx.body = 'Wrong credentials';
      }
    });

    return router;

}
