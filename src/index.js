import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';
import logger from 'koa-logger';
import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import cors from'koa2-cors';
import router from './router/index'
const app = new Koa();


// app.context.serverAddress = 'https://acc.yonyoucloud.com'
// app.context.serverAddress = 'http://u8cacc-test.yyuap.com'
// app.context.serverAddress = 'http://172.20.52.22'
app.context.serverAddress = 'http://u8cacc-test.yyuap.com'
app.context.cookies = 'JSESSIONID=658953C4655387C17B378B229EA4D0BB; tenantId=a65xtqwz; userId=99ea7655-00a2-4bda-b23c-19ade37ea574; locale=zh_CN; yht_access_token=btt8ddf6563-5ae1-4d74-a84d-76d68c623028__1559027341419; wb_at=LMjnnvjwyCHqD3pMuEMi8bqsAI5jbZrmnkdwZlokdknqf; PHPSESSID=jn54qv1ej6r7oacebajhu6nci0; jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkaXdvcmsiLCJzZXNzaW9uIjoie1wiY2xpZW50SXBcIjpcIjEwLjYuMjIzLjE3N1wiLFwiY3JlYXRlRGF0ZVwiOjE1NTkwMjczNDAsXCJleHRcIjp7XCJvcmdTdGF0dXNcIjpcIm11bHRpXCIsXCJhZG1pblwiOnRydWUsXCJsb2dvXCI6XCJodHRwczovL2ZpbGUtY2RuLnlvbnlvdWNsb3VkLmNvbS93b3JrYmVuY2gtaW1hZ2UtcGF0aC1hcHBsaWNhdGlvbkljb24vMjlkYTYzNzYtYTAwNS00YWRiLTgyMmItZDg3MmVmMGM5MjU5L3Bob3RvLmpwZ1wiLFwieWh0X2FjY2Vzc190b2tlblwiOlwiYnR0OGRkZjY1NjMtNWFlMS00ZDc0LWE4NGQtNzZkNjhjNjIzMDI4X18xNTU5MDI3MzQxNDE5XCJ9LFwiand0RXhwU2VjXCI6NjAsXCJqd3RWYWxpZERhdGVcIjoxNTU5MDI3NDAxLFwibGFzdERhdGVcIjoxNTU5MDI3NDAyLFwibG9jYWxlXCI6XCJ6aF9DTlwiLFwicHJvZHVjdExpbmVcIjpcInU4Y1wiLFwic2Vzc2lvbkV4cE1pblwiOjIxNjAsXCJzZXNzaW9uSWRcIjpcIkxNam5udmp3eUNIcUQzcE11RU1pOGJxc0FJNWpiWnJtbmtkd1psb2tka25xZlwiLFwic291cmNlSWRcIjpcImRpd29ya1wiLFwidGVuYW50SWRcIjpcImE2NXh0cXd6XCIsXCJ1c2VySWRcIjpcIjk5ZWE3NjU1LTAwYTItNGJkYS1iMjNjLTE5YWRlMzdlYTU3NFwifSIsImV4cCI6MTU1OTAyNzQ2Mn0.pvEcm--97VBKJt9gmfw0Pmv2FVWP4EcW49WBcRwbVR4'
app.context.customSend = {
  '/otp/ficloud_pub/initgrid': {"success":true,"message":"","data":[{"id":"des_action","lable":"目的功能","datatype":0,"length":50,"digit":0,"refinfo":null,"refinfocode":null,"enumdata":null,"hidden":null,"defaultvalue":null,"required":false,"multiple":null},{"id":"effector","lable":"生效条件","datatype":0,"length":2000,"digit":0,"refinfo":null,"refinfocode":null,"enumdata":null,"hidden":null,"defaultvalue":null,"required":false,"multiple":null},{"id":"id","lable":"实体标识","datatype":0,"length":40,"digit":0,"refinfo":null,"refinfocode":null,"enumdata":null,"hidden":null,"defaultvalue":null,"required":false,"multiple":null},{"id":"pk_org","lable":"组织","datatype":5,"length":40,"digit":0,"refinfo":"G001ZM0000BASEDOCORG0000000000000000","refinfocode":"org","enumdata":null,"hidden":null,"defaultvalue":null,"required":false,"multiple":null},{"id":"src_action","lable":"来源功能","datatype":0,"length":50,"digit":0,"refinfo":null,"refinfocode":null,"enumdata":null,"hidden":null,"defaultvalue":null,"required":false,"multiple":null},{"id":"billstate","lable":"目标凭证状态","datatype":6,"length":50,"digit":0,"refinfo":null,"refinfocode":null,"enumdata":[{"temp":"临时"},{"normal":"正式"}],"hidden":null,"defaultvalue":"normal","required":false,"multiple":null},{"id":"code","lable":"编码","datatype":0,"length":50,"digit":0,"refinfo":null,"refinfocode":null,"enumdata":null,"hidden":null,"defaultvalue":null,"required":true,"multiple":null},{"id":"name","lable":"名称","datatype":0,"length":200,"digit":0,"refinfo":null,"refinfocode":null,"enumdata":null,"hidden":null,"defaultvalue":null,"required":true,"multiple":null},{"id":"description","lable":"备注","datatype":0,"length":200,"digit":0,"refinfo":null,"refinfocode":null,"enumdata":null,"hidden":null,"defaultvalue":null,"required":false,"multiple":null},{"id":"src_system","lable":"来源系统","datatype":5,"length":50,"digit":0,"refinfo":"G001ZM0000BASEDOCOUTERSYS00000000001","refinfocode":"outersystem","enumdata":null,"hidden":null,"defaultvalue":null,"required":true,"multiple":null},{"id":"src_billtype","lable":"来源事项类型","datatype":5,"length":50,"digit":0,"refinfo":"G001ZM0000BASEDOCBILLTYPE00000000000","refinfocode":"otp_billtype","enumdata":null,"hidden":null,"defaultvalue":null,"required":true,"multiple":null},{"id":"src_tradetype","lable":"来源交易类型","datatype":5,"length":50,"digit":0,"refinfo":"G001ZM0000BASEDOCTRADETYPE0000000000","refinfocode":"otp_tradetype","enumdata":null,"hidden":null,"defaultvalue":null,"required":false,"multiple":null},{"id":"des_system","lable":"目的系统","datatype":5,"length":50,"digit":0,"refinfo":"G001ZM0000BASEDOCOUTERSYS00000000001","refinfocode":"outersystem","enumdata":null,"hidden":true,"defaultvalue":{"code":"figl","name":"财务云核算服务","id":"A8FD2BE5-E356-4CD3-A6EE-6DA68C72C3AC"},"required":true,"multiple":null},{"id":"des_billtype","lable":"目的事项类型","datatype":5,"length":50,"digit":0,"refinfo":"G001ZM0000BASEDOCBILLTYPE00000000000","refinfocode":"billtype","enumdata":null,"hidden":true,"defaultvalue":{"code":"C0","name":"财务云凭证","id":"G001ZM0000BILLTYPEFIER00000000000002"},"required":true,"multiple":null},{"id":"des_tradetype","lable":"目的交易类型","datatype":5,"length":50,"digit":0,"refinfo":"G001ZM0000BASEDOCTRADETYPE0000000000","refinfocode":"tradetype","enumdata":null,"hidden":true,"defaultvalue":null,"required":false,"multiple":null},{"id":"syncrun","lable":"同步执行","datatype":4,"length":4,"digit":0,"refinfo":null,"refinfocode":null,"enumdata":null,"hidden":true,"defaultvalue":"true","required":false,"multiple":null}],"code":1,"total":0},
  '/opt/ztc': {"name": "zhangtongchuan"}
}

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