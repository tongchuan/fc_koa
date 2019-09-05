## fc 项目中解决跨域问题

```
比如登录 https://acc.yonyoucloud.com/
修改 src/index.js 
app.context.serverAddress = 'http://www.ztc.com' //要访问的服务器
app.context.cookies= '登录后的cookies'
Cookie:改成你登录https://acc.www.com/中的Cookie

也可以修改
app.context.customSend = {
  key: value
}
key 是要访问的地址: 如:/otp/ficloud_pub/initgrid
value是返回的值对象json 值 {"success": true, "data": []}


在FC的 config.js 文件中修改
// serverHost='http://localhost:3333/'
// serverUrl='http://localhost:3333/ficloud'
和本地服务端口对应

```

## npm install 
## npm run start


## 	启动FC项目就应该可以正常访问要开发的页面了


## 存在问题, 可能有的接口不正常可以修改此项目中的

```
if(url==='/note/querytemplet_ctr/querybyid'){
		ctx.body = {"success":true,"message":"","data":[{"pk_group":null,"modifier":null,"description":null,"project":null,"employee":null,"dr":0,"pk_org":null,"basecurrency":null,"modifiedtime":null,"billtype":null,"def10":"","children":{"ar_init_b":[{"pk_group":null,"gift":null,"pricetaxtotal":null,"local_freeprice":null,"local_taxamount":null,"modifier":null,"num":null,"project":null,"employee":null,"dr":0,"pk_org":null,"local_freeamount":null,"taxprice":null,"supplier":null,"id":"714F8042-05B3-4C59-9FED-AE9BAEA62F84","state":0,"local_taxrate":null,"busiman":null,"taxrate":null,"warehouse":null,"taxamount":null,"creationtime":"2018-12-25 14:42:50","freeprice":null,"exchangerate":null,"description":null,"manufacturer":"","modifiedtime":null,"local_taxprice":null,"local_pricetaxtotal":null,"def10":"","billitemno":"3","tenantid":"v6luth84","def3":"","rowno":1,"def4":"","creator":null,"def1":"","def2":"","freeamount":null,"dept":null,"material":null,"def9":"","def7":"","def8":"","def5":"","ts":"2018-12-25 14:42:50","customer":null,"def6":""}]},"approvedate":null,"supplier":null,"tenantid":"v6luth84","currency":null,"id":"41536A28-772B-4699-A711-C6434DFC3B43","state":0,"busiman":null,"approver":null,"def3":"","rowno":null,"def4":"","creator":null,"busiaccbook":null,"period":"","def1":"","def2":"","maker":null,"objtype":null,"dept":null,"redflag":null,"accbody":null,"initflag":true,"billdate":null,"def9":"","dyentitycode":"ar_init","creationtime":"2018-12-25 14:42:50","def7":"","billno":"","def8":"","def5":"","ts":"2018-12-25 14:42:50","accpurposes":null,"customer":null,"def6":""}],"code":1,"total":1}
		return 
	}else if(url==='/favicon.ico'){
		return
	}

url 为接口地址,ctx.body就是要返回的json数据;
```
```
 
