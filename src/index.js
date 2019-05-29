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
app.context.iscache = false
app.context.serverAddress = 'http://u8cacc-test.yyuap.com'
app.context.cookies = 'JSESSIONID=AC7EE8B8EA47325CA99FA0026388FCE8; locale=zh_CN; locale=zh_CN; YKJ_IS_DIWORK=1; YKJ_DIWORK_DATA=%7B%22data%22%3A%7B%22is_diwork%22%3A1%2C%22cur_qzid%22%3A%2217982%22%7D%2C%22key%22%3A%221ec56e602c48b9a4af1fdec11a9ae054%22%7D; PHPSESSID=12pgmjbdsi121d5rpns10tl500; ck_safe_chaoke_csrf_token=5144ad294acbc7d3d39535f8887583ea; at=da252e1855df6402ae8e9d2f2bbc7678; yonyou_uid=99ea7655-00a2-4bda-b23c-19ade37ea574; yonyou_uname=u8c_vip%40163.com; yht_access_token=btte11e712a-f354-4ce6-a23a-07ec81f7dbfd__1559098611381; wb_at=LMjsspjqvsqZdBxAasonvDjI8qwjbZrmnkdwZlokdknqf; jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkaXdvcmsiLCJzZXNzaW9uIjoie1wiY2xpZW50SXBcIjpcIjEwLjYuMjIzLjE3N1wiLFwiY3JlYXRlRGF0ZVwiOjE1NTkwOTg2MTAsXCJleHRcIjp7XCJvcmdTdGF0dXNcIjpcIm11bHRpXCIsXCJhZG1pblwiOnRydWUsXCJsb2dvXCI6XCJodHRwczovL2ZpbGUtY2RuLnlvbnlvdWNsb3VkLmNvbS93b3JrYmVuY2gtaW1hZ2UtcGF0aC1hcHBsaWNhdGlvbkljb24vMjlkYTYzNzYtYTAwNS00YWRiLTgyMmItZDg3MmVmMGM5MjU5L3Bob3RvLmpwZ1wiLFwieWh0X2FjY2Vzc190b2tlblwiOlwiYnR0ZTExZTcxMmEtZjM1NC00Y2U2LWEyM2EtMDdlYzgxZjdkYmZkX18xNTU5MDk4NjExMzgxXCJ9LFwiand0RXhwU2VjXCI6NjAsXCJqd3RWYWxpZERhdGVcIjowLFwibGFzdERhdGVcIjoxNTU5MDk4NjExLFwibG9jYWxlXCI6XCJ6aF9DTlwiLFwicHJvZHVjdExpbmVcIjpcInU4Y1wiLFwic2Vzc2lvbkV4cE1pblwiOjIxNjAsXCJzZXNzaW9uSWRcIjpcIkxNanNzcGpxdnNxWmRCeEFhc29udkRqSThxd2piWnJtbmtkd1psb2tka25xZlwiLFwic291cmNlSWRcIjpcImRpd29ya1wiLFwidGVuYW50SWRcIjpcImE2NXh0cXd6XCIsXCJ1c2VySWRcIjpcIjk5ZWE3NjU1LTAwYTItNGJkYS1iMjNjLTE5YWRlMzdlYTU3NFwifSIsImV4cCI6MTU1OTA5ODY3MX0.THQSGzLaNMGnokOm1gQrG-82hSZLelWymLdx_51EdqM; tenantId=a65xtqwz; userId=99ea7655-00a2-4bda-b23c-19ade37ea574'
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