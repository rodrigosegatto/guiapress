const express = require ('express');
const configuration = require('./config/config');
const bodyParser = require('body-parser');
const conn = require('./database/database');
const app = express();

//Controllers
const CategoriesController = require('./controllers/CategoriesController');
const ArticlesController = require('./controllers/ArticlesController');

//Models
const CategoryModel = require('./models/CategoryModel');
const ArticleModel = require('./models/ArticleModel');

//View Engine
app.set('view engine','ejs');

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

//Rotas

//Usando as rotas de controllers
app.use('/', CategoriesController); //Dizendo que queremos utilizar as rotas do arquivo controller
app.use('/', ArticlesController); 

//Definindo uma rota inicial
app.get('/',(req,res) => {
    ArticleModel.findAll({
        order: [['id','DESC']]
    }).then(articles => { 
        CategoryModel.findAll().then(categories => {
            res.render('index', {articles, categories});
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
            res.render('index', {articles: category.articles, categories});
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
