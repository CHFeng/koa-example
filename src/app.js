import Koa from 'koa';
import koaBody from 'koa-body';
import bodyParser from 'koa-bodyparser';
import router from './routers/index.js';
import config from './config.js';

const app = new Koa();

app.use(koaBody());
app.use(bodyParser());
app.use(router.routes(), router.allowedMethods());

app.listen(config.port, async () => {
  console.log('Server Start on http://localhost:3000');
});

export default app;
