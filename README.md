# Blog GuiaPress

Sistema de blog desenvolvido no Curso de `Formação NodeJS` da Udemy.

## Como rodar?
Em base de testes crie um arquivo duplique o arquivo `.env` com nome de `.env.testing`.

Preencha as variaveis de ambiente como exemplo abaixo.

```printenv
    PORT=3000

    # Database
    DB_USER=root
    DB_PASS=secret123
    DB_DATABASE=guiapress
    DB_HOST=localhost

    #User Admin
    USER_ADMIN_EMAIL= admin@admin.com
    USER_ADMIN_PASSWORD= 123456
```

Execute:
> npm install

Rode o comando para **testes**:
> npm test

Ou para **produção**:
> npm start

## :computer: Tecnologias
- Bootstrap
- HTML5
- CSS
- Mysql
- NodeJS, **Libs:** `body-parser, dotenv, ejs, express, mysql2, sequelize, express-session, bcryptjs`

## Como ficou? 

<img src="https://user-images.githubusercontent.com/18685276/81702105-3f0fb300-9441-11ea-9b49-919758aa4cdf.PNG">
