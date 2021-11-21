var http = require('http');
var url = require('url'); //요구한다. url이라는 nodejs의 모듈.
var word = require('./lib/word');
var meaning = require('./lib/meaning');
var author = require('./lib/author');
var world = require('./lib/world');




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
  } else if(pathname === '/all') {
    word.all(request, response);
  } else if(pathname === '/create') {
    word.create(request, response);
  } else if(pathname === '/create_process') {
    word.create_process(request, response);
  } else if(pathname === '/update'){
    word.update(request, response);
  } else if(pathname === '/update_process'){
    word.update_process(request, response);
  } else if(pathname === '/delete_process') {
    word.delete(request, response);
  } else if(pathname === '/createMeaning') {
    meaning.createMeaning(request, response);
  } else if(pathname === '/createMeaning_process') {
    meaning.createMeaning_process(request, response);
  } else if(pathname === '/updateMeaning') {
    meaning.updateMeaning(request, response);
  } else if(pathname === '/updateMeaning_process') {
    meaning.updateMeaning_process(request, response);
  } else if(pathname === '/deleteMeaning_process') {
    meaning.deleteMeaning(request, response);
  } else if(pathname === '/author') {
    author.home(request, response);
  } else if(pathname === '/world') {
    world.home(request, response);
  } else if(pathname === '/world_create_process') {
    world.create_process(request, response);
  } else if(pathname === '/world_select_process') {
    world.select_process(request, response);
  } else {
    response.writeHead(404); //404: 파일을 찾을 수 없다.
    response.end('Not found');
  }
});
app.listen(3000);
