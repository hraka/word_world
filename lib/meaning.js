var url = require('url'); //요구한다. url이라는 nodejs의 모듈.
var db = require('./db');
var template = require('./template.js')
var qs = require('querystring');
var cookie = require('cookie');


function worldIsSelected(request, response) {
    var selected_world = 0;
    var cookies = {};
    if(request.headers.cookie !== undefined){
      cookies = cookie.parse(request.headers.cookie);
    }
    if(cookies.world !== undefined) {
      selected_world = cookies.world;
    }
    return selected_world;
  }

exports.createMeaning = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var selected_world = worldIsSelected(request, response);
    var sql = '';
    if(selected_world == 0) {
        sql = "SELECT * FROM word ORDER BY word";
    }
    else {
        sql = `SELECT * FROM word WHERE world_id = ${selected_world}`;
    }    
    db.query(sql, function(error, words){
        if(error) {
            throw error;
        }
        db.query(`SELECT * FROM word LEFT JOIN author ON word.author_id=author.id
                WHERE word.id=?`, [queryData.id], function(error2, word){
            if(error2) {
                throw error2;
            }
            db.query(`SELECT * FROM world`, function(error3, worlds){
                if(error3) {
                    throw error3;
                }
                db.query(`SELECT * FROM author`, function(error4, authors){
                    if(error4) {
                        throw error4;
                    }
                    var title = `${word[0].word} Create`;
                    var description = word[0].description;
                    var list = template.list(words);
                    var html = template.HTML(title, list, `
                        <h2>${title}</h2>
                        ${description}
                        <p>by ${word[0].name}</p>
                        <form action="/createMeaning_process" method="post">
                        <p>
                            <textarea name="meaning" placeholder="meaning" autofocus></textarea>
                        </p>
                        <p>
                            <textarea name="context" placeholder="context"></textarea>
                        </p>
                        <p>연관어: <input type="text" name="relation" placeholder="relation"></p>
                        <p>출처: <input type="text" name="source" placeholder="source"></p>
                        <input type="hidden" name="wid" value="${queryData.id}">
                        <p>
                            ${template.authorSelect(authors)}
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                        </form>
                        `,
                        `<a href="/create">create</a>`,
                        `<form action="world_select_process" method="post">
                            ${template.worldSelectChange(worlds, selected_world)}
                        </form>`
                        );

                    response.writeHead(200);
                    response.end(html);
                    
                    });
                });
            })          
        });
}
exports.createMeaning_process = function(request, response) {
    var body = '';

    //이벤트. 데이터를 가져올 수도 있고, 정보를 객체화 할 수도 있다.
    request.on('data', function(data){ //정보가 조각조각 들어올
      body += data;

      //보안장치로 body가 너무 크면 연결을 끊을 수도 있다.
    });
    request.on('end', function(){
      var post = qs.parse(body);
      db.query(`
            INSERT INTO meaning (meaning, created, word_id, author_id, source, relation, context)
              VALUES(?, NOW(), ?, ?, ?, ?, ?)`,
            [post.meaning, post.wid, post.author, post.source, post.relation, post.context],
            function(error, result){
              if(error) {
                throw error;
              }
              response.writeHead(302, {Location: `/?id=${post.wid}`});
              response.end();
            }
          )
    });
}
exports.updateMeaning = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;  
    var selected_world = worldIsSelected(request, response);
    var sql = '';
    if(selected_world == 0) {
        sql = "SELECT * FROM word ORDER BY word";
    }
    else {
        sql = `SELECT * FROM word WHERE world_id = ${selected_world}`;
    } 
    db.query(sql, function(error, words){
        db.query(`SELECT * FROM word LEFT JOIN author ON word.author_id=author.id
            WHERE word.id=?`, [queryData.id], function(error2, word){
            if(error2) {
                throw error2;
            }
            db.query(`SELECT * FROM meaning WHERE id = ?`,[queryData.mid], function(error3, meaning){
                if(error3){
                    throw error3;
                }
                db.query(`SELECT * FROM world`, function(error5, worlds){
                    if(error5) {
                        throw error5;
                    }
            
                    db.query(`SELECT * FROM author`, function(error4, authors){
                        var title = `${word[0].word}`;
                        var relation = '';
                        var source = '';
                        var context = '';
                        if(meaning[0].relation) {
                            relation = meaning[0].relation;
                        }
                        if(meaning[0].source) {
                            source = meaning[0].source;
                        }                        
                        if(meaning[0].context) {
                            context = meaning[0].context;
                        }
                        var description = word[0].description;
                        var list = template.list(words);
                        var html = template.HTML(title, list, `
                            <h2>${title}</h2>
                            ${description}
                            <p>by ${word[0].name}</p>
                            <form action="/updateMeaning_process" method="post">
                            <p>
                                <textarea name="meaning" placeholder="meaning" autofocus>${meaning[0].meaning}</textarea>
                            </p>
                            <p>
                                <textarea name="context" placeholder="context">${context}</textarea>
                            </p>
                            <p>연관어: <input type="text" name="relation" placeholder="relation" value="${relation}"></p>
                            <p>출처: <input type="text" name="source" placeholder="source" value="${source}"></p>
                            <input type="hidden" name="mid" value="${meaning[0].id}">
                            <input type="hidden" name="wid" value="${meaning[0].word_id}">
                            <p>
                                ${template.authorSelect(authors, meaning[0].author_id)}
                            </p>
                            <p>
                                <input type="submit">
                            </p>
                            </form>
                            `,
                            `<a href="/create">create</a>`,
                            `<form action="world_select_process" method="post">
                                ${template.worldSelectChange(worlds, selected_world)}
                            </form>`
                            );

                        response.writeHead(200);
                        response.end(html);
                    });
                });
            });
        })          
    });
}

exports.updateMeaning_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
       
        db.query(`UPDATE meaning SET meaning=?, author_id=?, source=?, relation=?, context=? WHERE id=?`, 
          [post.meaning, post.author, post.source, post.relation, post.context, post.mid],
          function(error, result){
            if(error) {
              throw error;
            }
            response.writeHead(302, {Location: `/?id=${post.wid}`});
            response.end();
          })
    });

}
exports.deleteMeaning = function(request, response) {
    var body = '';
    request.on('data', function(data){ 
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;

      db.query(`DELETE FROM meaning WHERE id = ?`, [post.id],
        function(error, result){
          if(error) {
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${post.wid}`});
          response.end();
      })
    });
}