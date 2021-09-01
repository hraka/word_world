module.exports = {
    html : function(title, list, body) {
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
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form>
            ${body}
      
          </body>
        </html>
        `;
      },
      
    list : function(filelist){
        var list = '<ul>'
        var i = 0;
        while(i < filelist.length) {
          list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i = i + 1;
        }
        var list = list + '</ul>';
        return list;
      }
}