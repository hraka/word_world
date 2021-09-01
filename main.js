var http = require('http');
var fs = require('fs');
var url = require('url'); //요구한다. url이라는 nodejs의 모듈.
var qs = require('querystring');
var template = require('./lib/template.js')
var mysql = require('mysql');
var connect = require('connect.js');

var connectInfo = connect.connectInfo;
console.log(connectInfo);
//var db = mysql.createConnection(connectInfo);


// var app = http.createServer(function(request,response){
//   var _url = request.url;
//   var queryData = url.parse(_url, true).query;
//   var pathname = url.parse(_url, true).pathname;
//   var title = queryData.id;

//   if(pathname === '/') {
//     if(queryData.id === undefined) {

//       fs.readdir('./data', 'utf8', function(error, filelist) {

//         var title = 'Welcome???';
//         var description = 'Hello, Node.js';
//         var list = template.list(filelist);

//         var html = template.html(title, list, `<h2>${title}</h2>${description}`);
//         response.writeHead(200); //파일을 성공적으로 전송했다.
//         response.end(html);
//       });



//     } else {

//         fs.readdir('./data', 'utf8', function(error, filelist) {

//         fs.readFile(`data/${title}`, 'utf8', function(err, description){
//           var list = template.list(filelist);

//           var html = template.html(title, list, `<h2>${title}</h2>${description}`);

//           response.writeHead(200); //파일을 성공적으로 전송했다.
//           response.end(html);
//         });
//       });


//     }
//   }
//   else if(pathname === '/create') {
//     fs.readdir('./data', 'utf8', function(error, filelist) {

//       var title = 'WEB - create';
//       var list = template.list(filelist);

//       var html = template.html(title, list, `
//         <form action="/create_process" method="post">
//           <p><input type="text" name="title" placeholder="title"></p>
//           <p>
//             <textarea name="description" placeholder="description"></textarea>
//           </p>
//           <p>
//             <input type="submit">
//           </p>
//         </form>
//       `);
//       response.writeHead(200); //파일을 성공적으로 전송했다.
//       response.end(html);
//     });
//   }
//   else if(pathname === '/create_process') {
//     var body = '';

//     //이벤트. 데이터를 가져올 수도 있고, 정보를 객체화 할 수도 있다.
//     request.on('data', function(data){ //정보가 조각조각 들어올
//       body = body + data;

//       //보안장치로 body가 너무 크면 연결을 끊을 수도 있다.
//     });
//     request.on('end', function(){
//       var post = qs.parse(body);
//       var title = post.title;
//       var description = post.description;

//       fs.writeFile(`data/${title}`, description, 'utf8',
//       function(err){
//         response.writeHead(302, {Location: `/?id=${qs.escape(title)}`}); //다른 곳으로 일시적 리다이렉.
//         response.end();
//       })
//     });

//   }

//   else if(pathname === '/delete_process') {
//     var body = '';

//     //이벤트. 데이터를 가져올 수도 있고, 정보를 객체화 할 수도 있다.
//     request.on('data', function(data){ //정보가 조각조각 들어올
//       body = body + data;

//       //보안장치로 body가 너무 크면 연결을 끊을 수도 있다.
//     });
//     request.on('end', function(){
//       var post = qs.parse(body);
//       var id = post.id;

//       fs.unlink(`data/${id}`, function(error){
//         response.writeHead(302, {Location: `/`}); //다른 곳으로 일시적 리다이렉.
//         response.end();
//       })
//     });

//   }
//   else {
//     response.writeHead(404); //404: 파일을 찾을 수 없다.
//     response.end('Not found');
//   }

});
app.listen(3000);
