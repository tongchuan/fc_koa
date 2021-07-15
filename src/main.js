var path=require("path");
var fs=require("fs");
var http=require("http");
 
//post值payload
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
        var Header={};
        var h=getBoundaryBorder(opts.boundary);
        var e=fieldPayload(opts);
        var a=getfieldHead(opts.param,opts.file);
        var d="\r\n"+h;
        Header["Content-Length"]=Buffer.byteLength(h+e+a+d)+buffer.length;
        Header["Content-Type"]='multipart/form-data; boundary='+opts.boundary;
        // Header['Cookies']='JSESSIONID=12AF90D0C5DF3551EBD57AD2A92E23A9; at=afa19d7e-970e-4a19-9a3d-e98de0efb7e5; yonyou_uid=f700fc77-853e-4107-aea6-1014e2bc7793; yonyou_uname=%E7%9F%AD%E4%BF%A1%E8%B4%A6%E6%88%B7%E5%8B%BF%E8%B5%8B%E6%9D%83%E9%99%90; yht_access_token=btt1f60bf04-6051-48b4-8f47-014e8d06c59f__1560761764490; wb_at=LMjnmtojLxNmuI9Na35aAmC5oeoojbZrmnkdwZlokdknqf; locale=zh_CN; YKJ_IS_DIWORK=1; YKJ_DIWORK_DATA=%7B%22data%22%3A%7B%22is_diwork%22%3A1%2C%22cur_qzid%22%3A%2218023%22%7D%2C%22key%22%3A%22ef1e519534723613f80143a13a5923f7%22%7D; yht_token=btt1f60bf04-6051-48b4-8f47-014e8d06c59f__1560761764490; tenantId=ofilyoxj; userId=f700fc77-853e-4107-aea6-1014e2bc7793; preTenantId=ofilyoxj; ck_safe_chaoke_csrf_token=f01c10fb69f5a73fdc7971b68be6ae80; PHPSESSID=uep1rdegdkjt227qu6nm8fd133; jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjA4MjUzODAsInNlc3Npb24iOiJ7XCJjbGllbnRJcFwiOlwiMTAuMy41LjUxXCIsXCJjcmVhdGVEYXRlXCI6MTU2MDc2MTc2NCxcImV4dFwiOntcIm9yZ1N0YXR1c1wiOlwic2luZ2xlXCIsXCJhZG1pblwiOnRydWUsXCJsb2dvXCI6XCJodHRwOi8vY2RuLnlvbnlvdWNsb3VkLmNvbS9kZXYvYXBjZW50ZXIvaW1nL2xvZ28vTE9HTy5wbmdcIixcInlodF9hY2Nlc3NfdG9rZW5cIjpcImJ0dDFmNjBiZjA0LTYwNTEtNDhiNC04ZjQ3LTAxNGU4ZDA2YzU5Zl9fMTU2MDc2MTc2NDQ5MFwiLFwib3JnSWRcIjpcIjEyNjA5NzkzNjE1ODMzNjBcIn0sXCJqd3RFeHBTZWNcIjo2MCxcImp3dFZhbGlkRGF0ZVwiOjE1NjA4MjUzMTcsXCJsYXN0RGF0ZVwiOjE1NjA4MjUzMjAsXCJsb2NhbGVcIjpcInpoX0NOXCIsXCJwcm9kdWN0TGluZVwiOlwidThjXCIsXCJzZXNzaW9uRXhwTWluXCI6MjE2MCxcInNlc3Npb25JZFwiOlwiTE1qbm10b2pMeE5tdUk5TmEzNWFBbUM1b2Vvb2piWnJtbmtkd1psb2tka25xZlwiLFwic291cmNlSWRcIjpcImRpd29ya1wiLFwidGVuYW50SWRcIjpcIm9maWx5b3hqXCIsXCJ1c2VySWRcIjpcImY3MDBmYzc3LTg1M2UtNDEwNy1hZWE2LTEwMTRlMmJjNzc5M1wifSIsInN1YiI6ImRpd29yayJ9.fOvwnvdV3F509xCHxBubqBF7z8jKT6f2tgGTyOe1wtA'
        // Header['cookies']='JSESSIONID=12AF90D0C5DF3551EBD57AD2A92E23A9; at=afa19d7e-970e-4a19-9a3d-e98de0efb7e5; yonyou_uid=f700fc77-853e-4107-aea6-1014e2bc7793; yonyou_uname=%E7%9F%AD%E4%BF%A1%E8%B4%A6%E6%88%B7%E5%8B%BF%E8%B5%8B%E6%9D%83%E9%99%90; yht_access_token=btt1f60bf04-6051-48b4-8f47-014e8d06c59f__1560761764490; wb_at=LMjnmtojLxNmuI9Na35aAmC5oeoojbZrmnkdwZlokdknqf; locale=zh_CN; YKJ_IS_DIWORK=1; YKJ_DIWORK_DATA=%7B%22data%22%3A%7B%22is_diwork%22%3A1%2C%22cur_qzid%22%3A%2218023%22%7D%2C%22key%22%3A%22ef1e519534723613f80143a13a5923f7%22%7D; yht_token=btt1f60bf04-6051-48b4-8f47-014e8d06c59f__1560761764490; tenantId=ofilyoxj; userId=f700fc77-853e-4107-aea6-1014e2bc7793; preTenantId=ofilyoxj; ck_safe_chaoke_csrf_token=f01c10fb69f5a73fdc7971b68be6ae80; PHPSESSID=uep1rdegdkjt227qu6nm8fd133; jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjA4MjUzODAsInNlc3Npb24iOiJ7XCJjbGllbnRJcFwiOlwiMTAuMy41LjUxXCIsXCJjcmVhdGVEYXRlXCI6MTU2MDc2MTc2NCxcImV4dFwiOntcIm9yZ1N0YXR1c1wiOlwic2luZ2xlXCIsXCJhZG1pblwiOnRydWUsXCJsb2dvXCI6XCJodHRwOi8vY2RuLnlvbnlvdWNsb3VkLmNvbS9kZXYvYXBjZW50ZXIvaW1nL2xvZ28vTE9HTy5wbmdcIixcInlodF9hY2Nlc3NfdG9rZW5cIjpcImJ0dDFmNjBiZjA0LTYwNTEtNDhiNC04ZjQ3LTAxNGU4ZDA2YzU5Zl9fMTU2MDc2MTc2NDQ5MFwiLFwib3JnSWRcIjpcIjEyNjA5NzkzNjE1ODMzNjBcIn0sXCJqd3RFeHBTZWNcIjo2MCxcImp3dFZhbGlkRGF0ZVwiOjE1NjA4MjUzMTcsXCJsYXN0RGF0ZVwiOjE1NjA4MjUzMjAsXCJsb2NhbGVcIjpcInpoX0NOXCIsXCJwcm9kdWN0TGluZVwiOlwidThjXCIsXCJzZXNzaW9uRXhwTWluXCI6MjE2MCxcInNlc3Npb25JZFwiOlwiTE1qbm10b2pMeE5tdUk5TmEzNWFBbUM1b2Vvb2piWnJtbmtkd1psb2tka25xZlwiLFwic291cmNlSWRcIjpcImRpd29ya1wiLFwidGVuYW50SWRcIjpcIm9maWx5b3hqXCIsXCJ1c2VySWRcIjpcImY3MDBmYzc3LTg1M2UtNDEwNy1hZWE2LTEwMTRlMmJjNzc5M1wifSIsInN1YiI6ImRpd29yayJ9.fOvwnvdV3F509xCHxBubqBF7z8jKT6f2tgGTyOe1wtA'
        options.headers=Header;
        options.method='POST';
// console.log(options)
        var req=http.request(options,function(res){
            var data='';
            // console.log(Object.keys(res));
            res.on('data', function (chunk) {
                // console.log('body',chunk);
                data+=chunk;
            });
            res.on('end', function (...arr) {
                // console.log(arr)
                console.log(res.statusCode)
                console.log(data);
            });
        });
// console.log(h+e+a);
// console.log(h+e+a+buffer+d);
//         req.write(h+e+a);
// console.log(h+e+a);
        req.write(h+e+a+buffer+d);
        // console.log(h+e+a+buffer+d);
        // console.log(buffer);
//         req.write(buffer);
        
        // req.on('response', function (response) {
        //   // console.log(response.headers)
        //   switch (response.headers['content-encoding']) {
        //       case 'gzip':
        //           var body = '';
        //           var gunzip = zlib.createGunzip();
        //           response.pipe(gunzip);
        //           gunzip.on('data', function (data) {
        //               body += data;
        //               console.log(body);
        //           });
        //           gunzip.on('end', function () {
        //               var returndatatojson= JSON.parse(body);
        //               console.log(returndatatojson);
        //               req.end();
        //           });
        //           gunzip.on('error', function (e) {
        //               console.log('error' + e.toString());
        //               req.end();
        //           });
        //           break;
        //       case 'deflate':
        //           var output = fs.createWriteStream("d:temp.txt");
        //           response.pipe(zlib.createInflate()).pipe(output);
        //           req.end();
        //           break;
        //       default:req.end();
        //           break;
        //   }
        // })

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
        var buffer = Buffer.alloc(length) //new Buffer(length);
        for(var i = 0, pos = 0, size = chunks.length; i < size; i++) {
            chunks[i].copy(buffer, pos);
            pos += chunks[i].length;
        }
        fn(buffer);
    });
}
 
//各类设置
var opt={
    "url":"http://127.0.0.1:8080/springmvc/upload/file",//url
    "file":"/home/tc/Desktop/1111111.png",//文件位置
    "param":"file",//文件上传字段名
    "field":{//其余post字段
//         "id":"",
//         "_":"1560837435366"
    },
    "boundary":"----WebKitFormBoundary"+getBoundary()
}
 
postRequest(opt);
