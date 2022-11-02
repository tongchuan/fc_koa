import Router from 'koa-router'
import fetch from 'node-fetch'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import querystring from 'querystring'
import FormData from 'form-data'
import request from 'request'
import https from 'https'

const secret = 'zhangtongchuan';
function getCookiesData(cookies){
 var pattern = /([0-9a-zA-Z-._]+)=([0-9a-zA-Z-._]+)/ig;
 var parames = {};
 cookies.replace(pattern, function(a, b, c){
  parames[b] = c;
 });
 return parames;
}
async function writeData(file,data){
  if(isExists(file)){
    return;
  }
  fs.writeFile(file,JSON.stringify(data),(err)=>{
    if(err){
      console.log(err);
    }
  })
  // let buf = Buffer.from(JSON.stringify(data),'utf8')
  // fs.writeFile(file,buf.toString('base64'),(err)=>{
  //   if(err){
  //     console.log(err);
  //   }
  // })
}

function isExists(file){
  try{
    let isexists = fs.accessSync(file, fs.constants.F_OK);
    if(isexists){
      return false
    }
  }catch(err){
    return false
  }
  return true
}

function randomWord(randomFlag, min, max){
    let str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(let i=0; i<range; i++){
        let pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

async function getFileData(file){
  if(isExists(file)){
    let data = fs.readFileSync(file,{encoding:'utf8',withFileTypes:false})
    return data
    return new Buffer(data,'base64').toString();
  }
  return false
}

async function getFilename(url,method,data){
  let filearray = []
  if(url){
    filearray.push(url.toString())
  }
  if(method){
    filearray.push(method.toString())
  }
  if(data){
    filearray.push(JSON.stringify(data).toString())
  }
  let filestring = filearray.join('')
  let buf = Buffer.alloc(filestring.length,filestring)
  
  let hash = crypto.createHmac('sha256', secret).update(buf.toString('base64')).digest('hex')
  return path.resolve(__dirname,'../../data',url.replace(/\//igm,'_')+'_'+hash+'.json')
}

async function getData(url,method,data,ctx){
  delete ctx.request.header.host
  let getparame = getCookiesData(ctx.cookies.value)
  getparame['XSRF-TOKEN'] = ctx.request.header['x-xsrf-token']
  let cookies = ''
  Object.keys(getparame).forEach((key)=>{
    cookies+=`${key}=${getparame[key]};`
  })
  console.log(cookies)
  // console.log(ctx.request.header['x-xsrf-token'])
  // console.log(getparame['XSRF-TOKEN'])
  // console.log(JSON.stringify(getparame))
  let options = {
      method: method,
      body:  method==='GET' ? undefined :JSON.stringify(data),
      headers: Object.assign(ctx.request.header,{ 
        'Cookie': cookies, //ctx.cookies.value,
      }),
  }
  let requestBody = ''
  // console.log([url,ctx.request.header['content-type']]);
  if(ctx.request.header['content-type'] && ctx.request.header['content-type'].indexOf('application/x-www-form-urlencoded') > -1){
    requestBody = ctx.request.body ? querystring.stringify(ctx.request.body) : undefined;
    options.body=requestBody
    options.headers['Content-Length'] = Buffer.byteLength(requestBody)
  }else if(ctx.request.header['content-type'] && ctx.request.header['content-type'].indexOf('application/json') > -1){
    requestBody = JSON.stringify(data); // JSON.stringify(ctx.request.body);
    // console.log(data,requestBody,ctx.request.body);
    if(method!=='GET'){
      options.body=requestBody //method==="POST" ? requestBody : undefined
      options.headers['Content-Length'] = Buffer.byteLength(requestBody)
    }
    
    
  }else if(ctx.request.header['content-type'] && ctx.request.header['content-type'].indexOf('multipart/form-data') > -1){

  }else {
    // console.log(method);
    if(method!=='GET'){
      requestBody = JSON.stringify(ctx.request.body)
      options.body=requestBody //method==="POST" ? requestBody : undefined
      options.headers['Content-Length'] = Buffer.byteLength(requestBody)
    }
    // requestBody = JSON.stringify(ctx.request.body)
    // options.body= requestBody//ctx.request.body
    // options.headers['Content-Length'] = Buffer.byteLength(requestBody)
  }
  // console.log('');
  // console.log(ctx.zhangtongchuan.ztc)
  // console.log('');
  // Object.defineProperty(ctx.zhangtongchuan,'ztc',{get:function(){
  //   return Math.random()
  // }})
  // ctx.zhangtongchuan = Math.random()
  // console.log(options);
	return await fetch(url, options)
    .then(res => {

      // console.log(ctx.cookies.value);
      let cookie = getCookiesData(ctx.cookies.value)
      let setCookie = res.headers.get('Set-Cookie')
      // console.log(cookie);
      if(setCookie && setCookie.length > 0){
        let newCookies = getCookiesData(setCookie)
        Object.keys(newCookies).forEach((key)=>{
          cookie[key]=newCookies[key]
        })
        let value = []
        Object.keys(cookie).forEach((key)=>{
          value.push(key,'=',cookie[key],';')
        })
        // console.log(value.join(''));
        Object.defineProperty(ctx.cookies,'value',{get:function(){
          return value.join('')
        }})
      }
      // console.log('--====-----');
      // console.log(ctx.cookies);
      // console.log('-----');
      // console.log(res.headers.get('Set-Cookie'));
      // console.log('=====');
     return res.json()
    })
    .then(json => {
      return json
    });
}


const router = Router();

router.all('*', async function(ctx){
  // console.log(ctx.request.body);
  // console.log(ctx.request.header);
  // ctx.body="{}"
  //   return;
	let url = ctx.request.url;
  // console.log(url);
	let method = ctx.request.method;
	if(method.toUpperCase()==='OPTIONS'){
    ctx.body=""
		return;
	}
  if(url==='/favicon.ico'){
		return ''
	}
  let body = null
  Object.keys(ctx.customSend).map((key)=>{
    if(key===url){
      body=ctx.customSend[key]
    }
  })
  if(body){
    ctx.body = body
    return
  }
	let data = null
	if(method.toUpperCase()==='POST'){
		data = ctx.request && ctx.request.body
	}
  console.log(url,method,data,ctx);
  if(ctx.iscache){
    let filename = await getFilename(url,method,data)
    // console.log(filename)
    let cacheData = await getFileData(filename)
    if(cacheData){
      ctx.body = JSON.parse(cacheData)
      return 
    }else{
      let jsonData = await getData(ctx.serverAddress + url,method,data,ctx)
      writeData(filename,jsonData)
      ctx.body = jsonData
      return ;
    }
  }else{
    let jsonData = await getData(ctx.serverAddress + url,method,data,ctx)
    ctx.body = jsonData
    return ;
  }
  
})

export default router
