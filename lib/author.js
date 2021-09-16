var db = require('./db');
var template = require('./template.js')

exports.home = function(request, response){
    db.query(`SELECT * FROM word`, function(error, words){
        db.query(`SELECT * FROM author`, function(error2, authors){
            
             
            var title = '저자';
            var description = '저자 목록';
            var list = template.list(words);
            var HTML = template.HTML(title, list,
                `
                ${template.authorTable(authors)}
                <style>
                    table {
                        border-collapse: collapse;
                    }
                    td{
                        border: 1px solid black;
                    }
                </style>
                `,
                `<a href="/create">create</a>`
            );
        
            response.writeHead(200);
            response.end(HTML);
        });       
    });
}