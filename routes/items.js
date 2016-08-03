import mongoose from 'mongoose';
import { itemModel } from '../models';
import { API_PREFIX } from '../config';

export default router => {

    const prefix = `${API_PREFIX}/items`;

    router.get(prefix, async (ctx) => {
        try {
            ctx.body = await itemModel.find();
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
                ctx.body = await itemModel.findById(ctx.params.id);
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
        const item = (ctx.request.body.title) ? ctx.request.body.title.trim() : '';
        if (item) {
            try {
                ctx.body = await new itemModel({ title: item, time: new Date() }).save();
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
        ctx.request.body.title = (ctx.request.body.title) ? ctx.request.body.title.trim() : '';
        if (ctx.request.body.title) {
            if (mongoose.Types.ObjectId.isValid(ctx.params.id)) {
                ctx.request.body.time = new Date();
                try {
                    ctx.body = await itemModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
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
                ctx.body = await itemModel.findByIdAndRemove(ctx.params.id);
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
