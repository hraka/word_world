var http = require('http');
var url = require('url'); //요구한다. url이라는 nodejs의 모듈.
var word = require('./lib/word');



var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if(pathname === '/') {
    if(queryData.id === undefined) {
      word.home(request, response);
    } else {
      word.word(request, response);
    }
  }
  else if(pathname === '/create') {
    word.create(request, response);
  } else if(pathname === '/create_process') {
    word.create_process(request, response);
  } else if(pathname === '/update'){
    word.update(request, response);
  } else if(pathname === '/update_process'){
    word.update_process(request, response);
  } else if(pathname === '/delete_process') {
    word.delete(request, response);
  }
  else {
    response.writeHead(404); //404: 파일을 찾을 수 없다.
    response.end('Not found');
  }
});
app.listen(3000);
