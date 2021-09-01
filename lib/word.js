var db = require('./db');
var template = require('./template.js')
var url = require('url'); //요구한다. url이라는 nodejs의 모듈.
var qs = require('querystring');



exports.home = function(request, response) {
    db.query(`SELECT * FROM word`, function(error, words){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(words);
        var HTML = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
    
        response.writeHead(200);
        response.end(HTML);
    });
}

exports.word = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;    
    db.query(`SELECT * FROM word`, function(error, words){
        if(error) {
          throw error; 
        } 
        //에러 값이 있다면 콘솔에 에러를 띄우고 아래 명령을 수행하지 않고 프로그램 중지
        db.query(`SELECT * FROM word LEFT JOIN author ON word.author_id=author.id WHERE word.id=?`, [queryData.id], function(error2, word){
          if(error2) {
            throw error2;
          }
          var title = word[0].word;
          var description = word[0].description;
          var list = template.list(words);
          var HTML = template.HTML(title, list,
                `<h2>${title}</h2>
                ${description}
                <p>by ${word[0].name}</p>`,
                `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                </form>`
              );
          response.writeHead(200);
          response.end(HTML);
        });
    });
}

exports.create = function(request, response) {
    db.query(`SELECT * FROM word`, 
        function(error, words){
          db.query(`SELECT * FROM author`, function(error2, authors){
            var title = 'Create';
            var list = template.list(words);
            var html = template.HTML(title, list, `
                <form action="/create_process" method="post">
                  <p><input type="text" name="title" placeholder="title"></p>
                  <p>
                    <textarea name="description" placeholder="description"></textarea>
                  </p>
                  <p>
                    ${template.authorSelect(authors)}
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
                  `<a href="/create">create</a>`
                );

            response.writeHead(200);
            response.end(html);
          })          
        }
    );
}
exports.create_process = function(request, response) {
    var body = '';

    //이벤트. 데이터를 가져올 수도 있고, 정보를 객체화 할 수도 있다.
    request.on('data', function(data){ //정보가 조각조각 들어올
      body = body + data;

      //보안장치로 body가 너무 크면 연결을 끊을 수도 있다.
    });
    request.on('end', function(){
      var post = qs.parse(body);
      db.query(`
            INSERT INTO word (word, description, created, author_id)
              VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, post.author],
            function(error, result){
              if(error) {
                throw error;
              }
              response.writeHead(302, {Location: `/?id=${result.insertId}`});
              response.end();
            }
          )
    });
}

exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query; 
    db.query(`SELECT * FROM word`, function(error, words){
        if(error) {
          throw error;
        }
        db.query(`SELECT * FROM word WHERE id=?`, [queryData.id],
          function(error2, word){
            if(error2) {
              throw error2;
            }
            db.query(`SELECT * FROM author`, function(error3, authors){
              var list = template.list(words);
              var html = template.HTML(word[0].word, list,
                `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${word[0].id}">
                  <p><input type="text" name="title" placeholder="title" value="${word[0].word}"></p>
                  <p>
                    <textarea name="description" placeholder="description">${word[0].description}</textarea>
                  </p>
                  <p>
                    ${template.authorSelect(authors, word[0].author_id)}
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update?id=${word[0].id}">update</a>`
              );
  
              response.writeHead(200);
              response.end(html);
            });
           
          }
        );
    });
}

exports.update_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
       
        db.query(`UPDATE word SET word=?, description=?, author_id=? WHERE id=?`, 
          [post.title, post.description, post.author, post.id],
          function(error, result){
            if(error) {
              throw error;
            }
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
          })
    });
}
exports.delete = function(request, response) {
    var body = '';

    //이벤트. 데이터를 가져올 수도 있고, 정보를 객체화 할 수도 있다.
    request.on('data', function(data){ //정보가 조각조각 들어올
      body = body + data;

      //보안장치로 body가 너무 크면 연결을 끊을 수도 있다.
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;

      db.query(`DELETE FROM word WHERE id = ?`, [post.id],
        function(error, result){
          if(error) {
            throw error;
          }
          response.writeHead(302, {Location: `/`});
          response.end();
      })
    });
}