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
            <a href="/author">author</a>
            <a href="/world">world</a>
      
            ${list}
            ${control}
            ${body}
      
          </body>
        </html>
        `;
    },
    meanings : function(meanings){
      var body = '';
      var i = 0;
      while(i < meanings.length) {
        var relation = '';
        var source = '';
        var context = '';
        if(meanings[i].relation) {
          relation = `<p>연관어: ${meanings[i].relation}</p>`;
        }
        if(meanings[i].source) {
          source = `<p>출처: ${meanings[i].source}</p>`;
        }
        if(meanings[i].context) {
          context = `${meanings[i].context} `;
        }
        body += `
        <p><b>${meanings[i].meaning}</b></p>
        <p>${context}</p>
        <p> by ${meanings[i].name} created ${meanings[i].created}</p>
        ${relation}
        ${source}
        <a href="/updateMeaning?id=${meanings[i].word_id}&mid=${meanings[i].id}">update</a>
        <form action="deleteMeaning_process" method="post" onsubmit="return confirm('삭제합니다')">
        <input type="hidden" name="id" value="${meanings[i].id}">
        <input type="hidden" name="wid" value="${meanings[i].word_id}">
        <input type="submit" value="delete">
        </form>`;
        i++;
      }
      return body;
    },

    meanings_with_word : function(meanings){
      var body = '';
      var i = 0;
      while(i < meanings.length) {
        var relation = '';
        var source = '';
        var context = '';
        if(meanings[i].relation) {
          relation = `<p>연관어: ${meanings[i].relation}</p>`;
        }
        if(meanings[i].source) {
          source = `<p>출처: ${meanings[i].source}</p>`;
        }
        if(meanings[i].context) {
          context = `${meanings[i].context} `;
        }
        body += `
        <p><b>${meanings[i].word}</b>  |  <b>${meanings[i].meaning}</b></p>
        <p>${context}</p>
        <p> by${meanings[i].author_id} created ${meanings[i].created}</p>
        ${relation}
        ${source}
        <a href="/updateMeaning?id=${meanings[i].word_id}&mid=${meanings[i].id}">update</a>
        <form action="deleteMeaning_process" method="post" onsubmit="return confirm('삭제합니다')">
        <input type="hidden" name="id" value="${meanings[i].id}">
        <input type="hidden" name="wid" value="${meanings[i].word_id}">
        <input type="submit" value="delete">
        </form>`;
        i++;
      }
      return body;
    },
      
    list : function(words){
        var list = '<ul><li><a href="/all">전체보기</a></i>'
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
    },
    authorTable(authors) {
      var tag='<table>';
      var i = 0;

      while(i < authors.length) {
          tag += `
              <tr>
                  <td>${authors[i].name}</td>
                  <td>${authors[i].profile}</td>
                  <td>update</td>
                  <td>delete</td>
              </tr>
              `;
          i++;
      }
      tag += `</table>`;

      return tag;
    },
    worldSelect(worlds, world_id){
      var tag = '';
      var i = 0;
      while(i < worlds.length) {
        var selected = ''
        if(worlds[i].id === world_id) {
          selected = ' selected';
        }
        tag += `<option value="${worlds[i].id}"${selected}>${worlds[i].name}</option>`;
        i++;
      }
      return `
      <select name="world">
        ${tag}
      </select>`;
    },
    worldTable(worlds) {
      var tag='<table>';
      var i = 0;

      while(i < worlds.length) {
          tag += `
              <tr>
                  <td>${worlds[i].name}</td>
                  <td>${worlds[i].profile}</td>
                  <td>update</td>
                  <td>delete</td>
              </tr>
              `;
          i++;
      }
      tag += `</table>`;

      return tag;
    }
}