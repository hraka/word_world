var http = require('http');
var fs = require('fs');
var url = require('url'); //요구한다. url이라는 모듈.

function templateHTML(title, list, body) {
  return `
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>


      <h1><a href="/">언어사전</a></h1>

      ${list}
      <a href="/create">create</a>
      ${body}

    </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>'
  var i = 0;
  while(i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  var list = list + '</ul>';
  return list;
}

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var title = queryData.id;

  if(pathname === '/') {
    if(queryData.id === undefined) {

      fs.readdir('./data', function(error, filelist) {

        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templateList(filelist);

        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
        response.writeHead(200); //파일을 성공적으로 전송했다.
        response.end(template);
      });



    } else {

        fs.readdir('./data', function(error, filelist) {

        fs.readFile(`data/${title}`, 'utf8', function(err, description){
          var list = templateList(filelist);

          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);

          response.writeHead(200); //파일을 성공적으로 전송했다.
          response.end(template);
        });
      });


    }
  }
  else if(pathname === '/create') {
    fs.readdir('./data', function(error, filelist) {

      var title = 'WEB - create';
      var list = templateList(filelist);

      var template = templateHTML(title, list, `
        <form action="/process_create" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `);
      response.writeHead(200); //파일을 성공적으로 전송했다.
      response.end(template);
    });
  }
  else {
    response.writeHead(404); //404: 파일을 찾을 수 없다.
    response.end('Not found');
  }

});
app.listen(3000);
