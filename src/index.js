import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';
import logger from 'koa-logger';
import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import cors from'koa2-cors';
import koaBody from 'koa-body'
import router from './router/index'

// import Router from 'koa-router'
// import routerfunction from './router/index'
const app = new Koa();

// app.context.serverAddress = 'http://172.20.52.22'
app.context.iscache = true
app.context.serverAddress = ''
app.context.cookies = {
  value:''
}
app.context.customSend = {
}

app.use(logger())
	.use(cors({
		origin: function(ctx){
			return ctx.header.origin //"http://localhost:4001";
		},
		exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
	    maxAge: 5,
	    credentials: true,
	    allowMethods: ['GET', 'POST', 'DELETE'],
	    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
	}))
	// .use(bodyParser())
  .use(compress())
  .use(koaBody({
    multipart: true,
    strict: false,
    formidable: {
        maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
  }))
  // .use(async function(ctx,next){
  //   console.log([ctx.request.url,JSON.stringify(ctx.header)]);
  //   next();
  // })
  .use(router.routes())
  .use(router.allowedMethods())
  .use(serve(path.join(process.cwd(), 'static')))


app.on('error', err => {
  console.error('server error', err)
});

app.listen(3333)
console.log('listening on port 3333');
