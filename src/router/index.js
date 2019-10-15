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
  delete ctx.request.header.host
  let options = {
      method: method,
      body:  method==='GET' ? undefined :JSON.stringify(data),
      headers: Object.assign(ctx.request.header,{ 
        // 'Content-Type': 'application/json',
        // origin: 'https://acc.yonyoucloud.com/',
        // referer: 'https://acc.yonyoucloud.com/',
        // Referer: 'https://acc.yonyoucloud.com/',
        'Cookie': ctx.cookies.value,
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
  /*
                                                      let jsondata ={
                                                                  success:true,
                                                                  data: {
                                                                    thumbnailUrl: "https://static.yonyoucloud.com/116795/3614956/201810/9/1539058976f63d1b9b52ec4171f4dba29428987f48.jpg.square.thumb.jpg",
                                                                    type: "image",
                                                                    url: "https://static.yonyoucloud.com/116795/3614956/201810/9/1539058976f63d1b9b52ec4171f4dba29428987f48.jpg"
                                                                  }
                                                                }
                                                                // ctx.body = jsondata
                                                                return jsondata
                                                                // return false;
                                                                
                                                            var getfield=function(field, value) {
                                                                return 'Content-Disposition: form-data; name="'+field+'"\r\n\r\n'+value+'\r\n';
                                                            }
                                                             
                                                            //文件payload
                                                            var getfieldHead=function (field, filename) {
                                                                var fileFieldHead='Content-Disposition: form-data; name="'+field+'"; filename="'+filename+'"\r\n'+'Content-Type: '+getMime(filename)+'\r\n\r\n';
                                                                return fileFieldHead;
                                                            }
                                                            //获取Mime
                                                            var getMime=function (filename) {
                                                                var mimes = {
                                                                    '.png': 'image/png',
                                                                    '.gif': 'image/gif',
                                                                    '.jpg': 'image/jpeg',
                                                                    '.jpeg': 'image/jpeg',
                                                                    '.js': 'appliction/json',
                                                                    '.torrent': 'application/octet-stream'
                                                                };
                                                                var ext = path.extname(filename);
                                                                var mime = mimes[ext];
                                                                mime=!!mime?mime:'application/octet-stream';
                                                                return mime;
                                                            }
                                                            //获取边界检查随机串
                                                            var getBoundary=function() {
                                                                var max = 9007199254740992;
                                                                var dec = Math.random() * max;
                                                                var hex = dec.toString(36);
                                                                var boundary = hex;
                                                                return boundary;
                                                            }
                                                            //获取boundary
                                                            var getBoundaryBorder=function (boundary) {
                                                                return '--'+boundary+'\r\n';
                                                            }
                                                            //字段格式化
                                                            function fieldPayload(opts) {
                                                                var payload=[];
                                                                for(var id in opts.field){
                                                                    payload.push(getfield(id,opts.field[id]));
                                                                }
                                                                payload.push("");
                                                                return payload.join(getBoundaryBorder(opts.boundary));
                                                            }
                                                             
                                                            //post数据
                                                            function postRequest (opts) {
                                                                filereadstream(opts,function (buffer) {
                                                                    var options=require('url').parse(opts.url);
                                                            //         var Header={};
                                                                    var Header=Object.assign(ctx.request.header,{ 
                                                                        // 'Content-Type': 'application/json',
                                                                        origin: 'https://acc.yonyoucloud.com',
                                                                        referer: 'https://acc.yonyoucloud.com/home_index.html?version=&accbook=E3120E12-C3B5-416E-9308-4ECA8203ECF3&showacc=true&frame_title=5paw5aKe5Yet6K-B&code=newvoucher&params=%7B%7D',
                                                                        Referer: 'https://acc.yonyoucloud.com/home_index.html?version=&accbook=E3120E12-C3B5-416E-9308-4ECA8203ECF3&showacc=true&frame_title=5paw5aKe5Yet6K-B&code=newvoucher&params=%7B%7D',
                                                                        'Cookie': ctx.cookies,
                                                                      })
                                                                    delete Header['content-length']
                                                                    delete Header['content-type']
                                                                    var h=getBoundaryBorder(opts.boundary);
                                                                    var e=fieldPayload(opts);
                                                                    var a=getfieldHead(opts.param,opts.file);
                                                                    var d="\r\n"+h;
                                                                    Header["Content-Length"]=Buffer.byteLength(h+e+a+d)+buffer.length;
                                                                    Header["Content-Type"]='multipart/form-data'//'multipart/form-data; boundary='+opts.boundary;
                                                                    // Header['Accept']='application/json'
                                                                    Header['Cookie'] = ctx.cookies
                                                                    Header['url'] = opts.url
                                                                    console.log(JSON.stringify(Header));
                                                                    options.headers=Header;
                                                                    options.method='POST';
                                                                    var req= https.request(options,function(res){
                                                                        var data='';
                                                                        res.on('data', function (chunk) {
                                                                            data+=chunk;
                                                                        });
                                                                        res.on('end', function () {
                                                                            console.log(res.statusCode)
                                                                            console.log(data);
                                                                            ctx.body=data;
                                                                            return;
                                                                        });
                                                                    });
                                                                    req.write(h+e+a);//log.diy(h+e+a+buffer+d);
                                                                    req.write(buffer);
                                                                    req.end(d);
                                                                });
                                                                
                                                            }
                                                            //读取文件
                                                            function filereadstream(opts, fn) {
                                                                var readstream = fs.createReadStream(opts.file,{flags:'r',encoding:null});
                                                                var chunks=[];
                                                                var length = 0;
                                                                readstream.on('data', function(chunk) {
                                                                    length += chunk.length;
                                                                    chunks.push(chunk);
                                                                });
                                                                readstream.on('end', function() {
                                                                    var buffer = new Buffer(length);
                                                                    for(var i = 0, pos = 0, size = chunks.length; i < size; i++) {
                                                                        chunks[i].copy(buffer, pos);
                                                                        pos += chunks[i].length;
                                                                    }
                                                                    fn(buffer);
                                                                });
                                                            }

                                                            let files = ctx.request.files.files;

                                                                var opt={
                                                                  "url": 'https://acc.yonyoucloud.com/ficloud/voucher/upload?id=&_=1560308898027',//url,//url
                                                                  "file":files.path,//文件位置
                                                                  "param":"files",//文件上传字段名
                                                                  "field":{//其余post字段
                                                                      "id":"1",
                                                                  },
                                                                  "boundary":"----WebKitFormBoundary"+getBoundary()
                                                                }
                                                                postRequest(opt);
                                                                return;
                                                                */
                                                                /*
                                                                // var j = request.jar()
                                                                // var cookie = request.cookie(ctx.cookies)
                                                                // var ds = await ctx.req.pipe(request.post(url))
                                                                // console.log(ctx.req);
                                                                // ctx.body={name:ds}
                                                                // return false
                                                                // console.log(url);
                                                                //  const res = await ctx.req.pipe(request.post(url)) // 这里请求真正的接口
                                                                //  // console.log(JSON.stringify(res));
                                                                // ctx.body = {name: "zjanmg"}
                                                                // return
                                                                // console.log(path);
                                                                // return;
                                                                
                                                                // const fileName = 'dddd'+ctx.request.body.name;
                                                                // const file = ctx.request.files.files;
                                                                // const render = fs.createReadStream(file.path);
                                                                // let filePath = path.join(__dirname, 'upload/',fileName+'.'+file.name.split('.').pop());
                                                                // const fileDir = path.join(__dirname, 'upload/');
                                                                // console.log(fileDir);
                                                                // if (!fs.existsSync(fileDir)) {
                                                                //   fs.mkdirSync(fileDir, err => {
                                                                //     console.log(err)
                                                                //     console.log('创建失败')
                                                                //   });
                                                                // }
                                                                // // 创建写入流
                                                                // const upStream = fs.createWriteStream(filePath);
                                                                // render.pipe(upStream);
                                                                // ctx.body = '上传成功'
                                                                // return
                                                                


                                                                // const form = new FormData()
                                                                // // console.log(ctx.request.files);
                                                                // const render = fs.createReadStream(ctx.request.files.files.path)
                                                                // form.append('files', render)
                                                                // console.log(form);

                                                                // // options.method = 'PUT'
                                                                // options.body=form //requestBody
                                                                // options.headers['Content-Type'] = `multipart/form-data`;

                                                                let files = ctx.request.files.files;
                                                                // console.log(files);
                                                                let filesLength = 0;
                                                                let boundaryKey = randomWord(false,34);
                                                                let boundary = `\r\n------${boundaryKey}\r\n`;
                                                                let endData = `\r\n------${boundaryKey}--`;
                                                                if(Object.prototype.toString.call(files)==='[object Object]'){
                                                                  // let da = fs.readFileSync(files.path,'binary')
                                                                  // let fda = Buffer.from(da)
                                                                  // console.log(fda);
                                                                  // const stream = fs.createReadStream(files.path);
                                                                  // console.log(stream);
                                                                  // console.log(da.toString('base64')); Content-Type:application/octet-stream\r\n   \r\nfiles=${fda.toString('binary')}
                                                                  requestBody += `${boundary}Content-Disposition: form-data; name="files"; filename="${files.path}"\r\n\r\n`;
                                                                  filesLength += Buffer.byteLength(requestBody,'utf-8') + files.size;
                                                                  // ctx.response.body=fda
                                                                  //requestBody //{name:'files',files: ctx.request.files.files } //requestBody //requestBody
                                                                // console.log(JSON.stringify({files:fda.toString('binary')}))
                                                                  // const render = fs.createReadStream(files.path);
                                                                  // render.pipe();
                                                                }else if(Object.prototype.toString.call(files)==='[object Array]'){
                                                                  files.forEach((file)=>{
                                                                    requestBody += `${boundary}Content-Disposition: form-data; name="files"; filename="${file.name}"\r\nContent-Type=${file.type}\r\n\r\n`;
                                                                    filesLength += Buffer.byteLength(requestBody,'utf-8') + file.size;
                                                                  })
                                                                }
                                                                // const render = fs.createReadStream(files.path);
                                                                // console.log(requestBody);
                                                                requestBody += endData
                                                                options.body = requestBody
                                                                // console.log(JSON.stringify(requestBody));
                                                                // console.log(JSON.stringify(ctx.request.files.files));
                                                                // console.log(filesLength);
                                                                options.headers['Content-Type'] = `multipart/form-data; boundary=----${boundaryKey}`;
                                                                options.headers['Content-Length'] = filesLength + Buffer.byteLength(endData);
      */
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

      console.log(ctx.cookies.value);
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
