# Git

한글 커밋은 https://blog2.deliwind.com/20200316/%EC%98%AC%EB%B0%94%EB%A5%B8-commit-%EB%A9%94%EC%84%B8%EC%A7%80%EB%A5%BC-%EC%9E%91%EC%84%B1%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95/ 블로그 글을 참고하여 작성한다.

# word_world

`node.js`가 웹서버로 동작한다.

`mysql` 모듈을 설치하였다.

특정 형태로 설계된 `mysql 데이터베이스`와 연동되어야 동작한다.

사용자에게 무엇을 웹페이지로 보여줄지 프로그래밍적으로 제어할 수 있다.


## 실행 환경 구성

`node main.js` 또는

`pm2 start main.js --watch`

문제확인 `pm2 log`



## 자주 쓰는 명령어 모음

### MySQL
`show databases;`
`use ~;`

### DB 수정

`ALTER TABLE table_name ADD COLUMN ex_column varchar(32) NOT NULL;`


## 코드

### 모듈

`module.exports`

`require(위치)`





## 참고

- 오픈튜토리얼스 Node.js
https://opentutorials.org/course/3332
- 오픈튜토리얼스 Node.js - MySQL
https://opentutorials.org/course/3347
