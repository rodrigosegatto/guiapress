const express = require ('express');
const configuration = require('./config/config');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const conn = require('./database/database');
const app = express();

//Controllers
const CategoriesController = require('./controllers/CategoriesController');
const ArticlesController = require('./controllers/ArticlesController');
const UsersController = require('./controllers/UsersController');

//Models
const CategoryModel = require('./models/CategoryModel');
const ArticleModel = require('./models/ArticleModel');
const UserModel = require('./models/UserModel');

//View Engine
app.set('view engine','ejs');

//Sessões
app.use(session({
    secret: configuration.secret,
    cookie: {maxAge: 7200000}, //magAge - Tempo para deslogar em milisegundos (120 min)
    resave: false,
    saveUninitialized: false
}));

//Utilizar arquivos estáticos com express (Ex: css, js, imagens, etc..)
app.use(express.static('public'));

//Body Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Database
conn.authenticate()
    .then(() => {
        console.log('Conexão com banco de dados realizada com sucesso!')
    })
    .catch((error) => {
        console.log('Erro ao conectar no Banco de Dados')
    });

//criar usuário admin caso não exista
UserModel.findOne({
    where: {email: configuration.userAdmin.email}
}).then(user => {
    if(!user){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(configuration.userAdmin.password, salt);
        UserModel.create({
            email: configuration.userAdmin.email,
            password: hash
        });
    }
});

//Rotas

//Usando as rotas de controllers
app.use('/', CategoriesController); //Dizendo que queremos utilizar as rotas do arquivo controller
app.use('/', ArticlesController); 
app.use('/', UsersController); 

//Definindo uma rota inicial
app.get('/:page?',(req,res) => {
    const {page = 1} = req.params;
    
    var offset = parseInt(page-1) * 3;
    if(isNaN(page) || page == 1)
        offset = 0;

    ArticleModel.findAndCountAll({
        order: [['id','DESC']],
        limit: 3,
        offset: offset
    }).then(articles => { 
        var next = true;
        if(offset + 3 >= articles.count)
            var next = false;
        CategoryModel.findAll().then(categories => {
            res.render('index', {page: parseInt(page), next, articles, categories, paginate: true});
        });       
    })
});

app.get('/:slug', (req, res) => {
    const {slug} = req.params;
    ArticleModel.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(!article)
            return res.redirect('/');
        CategoryModel.findAll().then(categories => {
            res.render('index', {article, categories});
        });
    }).catch(err => {
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    const {slug} = req.params;
    CategoryModel.findOne({
        where: {
            slug: slug
        },
        include: [{model: ArticleModel}]
    }).then(category => {
        if(!category)
            return res.redirect('/');
        CategoryModel.findAll().then(categories => {
            var articles = {};
            articles.rows = category.articles;
            res.render('index', {articles, categories, paginate: false});
        });
    }).catch(err => {
        res.redirect('/');
    });
});

//Iniciar App
app.set('port',configuration.port || 3000);
app.listen(app.get('port'), () => {
    console.log(`Server running at port: ${app.get('port')}/`);
});
