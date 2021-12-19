var db = require('./db');
var template = require('./template.js')
var url = require('url'); //요구한다. url이라는 nodejs의 모듈.
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

exports.home = function(request, response) {
  var selected_world = worldIsSelected(request, response);
  var title = 'Welcome';
  var description = '당신의 언어를 정의하고 세상을 만드세요';
  var sql = '';
  if(selected_world == 0) {
    sql = "SELECT * FROM word ORDER BY word";
  }
  else {
    sql = `SELECT * FROM word WHERE world_id = ${selected_world}`;
  }
  db.query(sql, function(error, words){
    db.query(`SELECT * FROM world`, function(error2, worlds){
      if(selected_world != 0){
        title = `${worlds[selected_world - 1].name} 세계`;
        description = '세계의 단어입니다.';
      }
      var list = template.list(words);
      var HTML = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`,
          `<form action="world_select_process" method="post">
            ${template.worldSelectChange(worlds, selected_world)}
          </form>`
      );
  
      response.writeHead(200);
      response.end(HTML);
    });
      
  });
}

exports.all = function(request, response) {
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
        //에러 값이 있다면 콘솔에 에러를 띄우고 아래 명령을 수행하지 않고 프로그램 중지
        // db.query(`SELECT * FROM word LEFT JOIN author ON word.author_id=author.id
        //     WHERE word.id=?`, [queryData.id], function(error2, word){
        //   if(error2) {
        //     throw error2;
          // }

          // 뜻을 보여주되, 선택된 세계에 맞는 뜻을 보여준다?
          // 뜻을 가져오고, 가져오는 기준은 뜻이 포함된 word의 world_id 값이다.
          // selected_world 값과 일치해야 한다.
          db.query(`SELECT * FROM meaning LEFT JOIN word ON meaning.word_id=word.id where world_id= ? ORDER BY meaning.id DESC limit 15`, [selected_world],
            function(error2, meanings){
                if(error2){
                    throw error2;
                }

                db.query(`SELECT * FROM world`, function(error3, worlds) {
                  var title = `전체 단어들`;
                  if(selected_world != 0) {
                    title=`${worlds[selected_world - 1].name}의 뜻들`;
                  }
                  var description = `최근 생성된 뜻들`;
                  var list = template.list(words);
                  var body = template.meanings_with_word(meanings);
                  var HTML = template.HTML(title, list,
                          `<h2>${title}</h2>
                          ${description}
                          ${body}
                          `,
                          `<a href="/create">create</a>`,
                          `<form action="world_select_process" method="post">
                            ${template.worldSelectChange(worlds, selected_world)}
                          </form>`
                      );
                  response.writeHead(200);
                  response.end(HTML);
                });
                
                
            });
          
        //});
    });
}

exports.word = function(request, response) {
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
        //에러 값이 있다면 콘솔에 에러를 띄우고 아래 명령을 수행하지 않고 프로그램 중지
        db.query(`SELECT * FROM word LEFT JOIN world ON word.world_id=world.id
            WHERE word.id=?`, [queryData.id], function(error2, word){
          if(error2) {
            throw error2;
          }
          db.query(`SELECT meaning.id, meaning, created, word_id, author_id, source, relation, context, onoff, name FROM meaning JOIN author ON meaning.author_id=author.id WHERE word_id = ? ORDER BY meaning.id DESC`,[queryData.id],
            function(error3, meanings){
                if(error3){
                    throw error3;
                }
                db.query(`SELECT * FROM world`, function(error4, worlds){
                  var title = word[0].word;
                var description = word[0].description;
                var list = template.list(words);
                var body = template.meanings(meanings);
                var HTML = template.HTML(title, list,
                        `<h2>${title}</h2>
                        ${description}
                        <p>on ${word[0].name}</p>
                        <a href="/createMeaning?id=${queryData.id}" autofocus>create</a>
                        ${body}
                        `
                        ,
                        `<a href="/create">create</a>
                        <a href="/update?id=${queryData.id}">update</a>
                        <form action="delete_process" method="post" onsubmit="return confirm('단어를 삭제합니다')">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <input type="submit" value="delete">
                        </form>`,
                        `<form action="world_select_process" method="post">
                          ${template.worldSelectChange(worlds, selected_world)}
                        </form>`
                    );
                response.writeHead(200);
                response.end(HTML);
                });

            });
          
        });
    });
}



exports.create = function(request, response) {
  var selected_world = worldIsSelected(request, response);
  var sql = '';
  if(selected_world == 0) {
    sql = "SELECT * FROM word ORDER BY word";
  }
  else {
    sql = `SELECT * FROM word WHERE world_id = ${selected_world}`;
  }  
  db.query(sql, function(error, words){
    db.query(`SELECT * FROM author`, function(error2, authors){
      db.query(`SELECT * FROM world`, function(error3, worlds){
        var title = 'Word Create';
        var list = template.list(words);
        var html = template.HTML(title, list, 
          `
            <h2>${title}</h2>
            <form action="/create_process" method="post">
            <p>
                ${template.worldSelect(worlds, selected_world)}
            </p>  
            <p><input type="text" name="title" placeholder="title" autofocus></p>
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
      INSERT INTO word (word, description, created, author_id, world_id)
        VALUES(?, ?, NOW(), ?, ?)`,
      [post.title, post.description, post.author, post.world],
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
  var selected_world = worldIsSelected(request, response);
  var _url = request.url;
  var queryData = url.parse(_url, true).query; 
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
      db.query(`SELECT * FROM word WHERE id=?`, [queryData.id],
        function(error2, word){
          if(error2) {
            throw error2;
          }
          db.query(`SELECT * FROM author`, function(error3, authors){
            if(error3){
              throw error3;
            }
            db.query(`SELECT * FROM world`, function(error4, worlds){
              if(error4){
                throw error4;
              }
              var list = template.list(words);
              var html = template.HTML(word[0].word, list,
                `
                <form action="/update_process" method="post">
                  <p>
                    ${template.worldSelect(worlds, word[0].world_id)}
                  </p>
                  <input type="hidden" name="id" value="${word[0].id}">
                  <p><input type="text" name="title" placeholder="title" value="${word[0].word}" autofocus></p>
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
                `<a href="/create">create</a> <a href="/update?id=${word[0].id}">update</a>`,
                `<form action="world_select_process" method="post">
                  ${template.worldSelectChange(worlds, selected_world)}
                </form>`
              );

              response.writeHead(200);
              response.end(html);
            });
            
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
       
        db.query(`UPDATE word SET word=?, description=?, author_id=?, world_id=? WHERE id=?`, 
          [post.title, post.description, post.author, post.world, post.id],
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

exports.author = function(request, response) {
  var _url = request.url;
    var queryData = url.parse(_url, true).query;    
    db.query(`SELECT * FROM author`, function(error, authors){
        if(error) {
          throw error; 
        }                    
        var title = '사용자';
        var description = '사용자 목록';
        var list = template.list(words);
        var body = template.meanings_with_word(meanings);
        var HTML = template.HTML(title, list,
                `<h2>${title}</h2>
                ${description}
                <p><a href="/createMeaning?id=${queryData.id}" autofocus>create</a></p>
                ${body}
                `
                ,
                ``
            );
        response.writeHead(200);
        response.end(HTML);
    });
          

}

// exports.world = function(request, response) {
//   var _url = request.url;
//   var queryData = url.parse(_url, true).query;
//   db.query(`SELECT * FROM word WHERE world_id = ?`, [queryData.world], function(error, words){
    
//       var title = 'Welcome';
//       var description = '당신의 언어를 정의하고 세상을 만드세요';
//       var list = template.list(words);
//       var HTML = template.HTML(title, list,
//           `<h2>${title}</h2>${description}`,
//           `<a href="/create">create</a>`,
//           ``
//       );
  
//       response.writeHead(200);
//       response.end(HTML);
//     });
// }