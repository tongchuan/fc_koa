import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';
import logger from 'koa-logger';
import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import cors from'koa2-cors';
import router from './router/index'
const app = new Koa();
console.log(process.cwd());
app.use(logger())
	.use(cors({
		origin: function(ctx){
			return "*";
		},
		exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
	    maxAge: 5,
	    credentials: true,
	    allowMethods: ['GET', 'POST', 'DELETE'],
	    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
	}))
	.use(bodyParser())
  .use(compress())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(serve(path.join(process.cwd(), 'static')))
app.listen(3333)
console.log('listening on port 3333');