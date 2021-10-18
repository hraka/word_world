var db = require('./db');
var template = require('./template.js')
var qs = require('querystring');

exports.home = function(request, response){
    db.query(`SELECT * FROM word`, function(error, words){
        db.query(`SELECT * FROM world`, function(error2, worlds){
            db.query(`SELECT * FROM author`, function(error3, authors){
                var title = '세계';
                var description = '세계 목록';
                var list = template.list(words);
                var HTML = template.HTML(title, list,
                    `
                    <h1>${title}</h1>
                    <p>${description}</p>
                    ${template.worldTable(worlds)}
                    <style>
                        table {
                            border-collapse: collapse;
                        }
                        td{
                            border: 1px solid black;
                        }
                    </style>
                    <form action="/world_create_process" method="post">
                    <p><input type="text" name="name" placeholder="world name" autofocus></p>
                    <p>
                      <textarea name="profile" placeholder="profile"></textarea>
                    </p>
                    <p>
                        ${template.authorSelect(authors)}
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>
                    `,
                    `
                    `
                );
            
                response.writeHead(200);
                response.end(HTML);
            });
        
        });       
    });
}
exports.create_process = function(request, response){
    var body = '';

    request.on('data', function(data){
      body = body + data;

     
    });
    request.on('end', function(){
      var post = qs.parse(body);
      db.query(`
            INSERT INTO world (name, profile, created, author_id)
              VALUES(?, ?, NOW(), ?)`,
            [post.name, post.profile, post.author, post.world],
            function(error, result){
              if(error) {
                throw error;
              }
              response.writeHead(302, {Location: `/world`});
              response.end();
            }
          )
    });
}