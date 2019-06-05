import Router from 'koa-router'
import fetch from 'node-fetch'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const secret = 'zhangtongchuan';
async function writeData(file,data){
  if(isExists(file)){
    return;
  }
  let buf = Buffer.from(JSON.stringify(data),'utf8')
  fs.writeFile(file,buf.toString('base64'),(err)=>{
    if(err){
      console.log(err);
    }
  })
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

async function getFileData(file){
  if(isExists(file)){
    let data = fs.readFileSync(file,{encoding:'utf8',withFileTypes:false})
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
  return path.resolve(__dirname,'../../data',hash)
}

async function getData(url,method,data,ctx){
	return fetch(url, {
        method: method,
        body:  method==='GET' ? undefined :JSON.stringify(data),
        headers: { 
        	'Content-Type': 'application/json',
        	'Cookie': ctx.cookies,
        },
    })
    .then(res => res.json())
    .then(json => {
      return json
    });
}


const router = Router();
router.all('*', async function(ctx){
	let url = ctx.request.url;
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
  if(ctx.iscache){
    let filename = await getFilename(url,method,data)
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