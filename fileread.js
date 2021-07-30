var fs = require('fs');

fs.readFile('sample.txt', 'utf8', function(err, data) { //위치 기준은 이 파일위치가 아니라 노드가 실행되는 곳.
  console.log(data);
});
