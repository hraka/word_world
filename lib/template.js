module.exports = {
    HTML : function(title, list, body, control) {
        return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>언어사전 - ${title}</title>
          </head>
          <body>

            <h1><a href="/">언어사전</a></h1>
      
            ${list}
            ${control}
            ${body}
      
          </body>
        </html>
        `;
    },
      
    list : function(words){
        var list = '<ul>'
        var i = 0;
        while(i < words.length) {
          list = list + `<li><a href="/?id=${words[i].id}">${words[i].word}</a></li>`;
          i = i + 1;
        }
        var list = list + '</ul>';
        return list;
    },
    authorSelect(authors, author_id){
      var tag = '';
      var i = 0;
      while(i < authors.length) {
        var selected = ''
        if(authors[i].id === author_id) {
          selected = ' selected';
        }
        tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
        i++;
      }
      return `
      <select name="author">
        ${tag}
      </select>`;
    }
}