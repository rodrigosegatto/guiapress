require('dotenv').config({  
    path: process.env.NODE_ENV === "test" ? '.env.testing' : '.env'
});

module.exports = {
    port: process.env.PORT,
    secret: process.env.SECRET,
    userAdmin: {
        email: process.env.USER_ADMIN_EMAIL,
        password: process.env.USER_ADMIN_PASSWORD
    },
    mysql_prod : {
        client: 'mysql',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        db: process.env.DB_DATABASE,
        host: process.env.DB_HOST
    }
}