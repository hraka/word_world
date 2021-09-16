var db = require('./db');
var template = require('./template.js')

exports.home = function(request, response){
    db.query(`SELECT * FROM word`, function(error, words){
        db.query(`SELECT * FROM world`, function(error2, worlds){
            
             
            var title = '세계';
            var description = '세계 목록';
            var list = template.list(words);
            var HTML = template.HTML(title, list,
                `
                ${template.worldTable(worlds)}
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