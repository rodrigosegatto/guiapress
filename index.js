const express = require ('express');
const configuration = require('./config/config');
const bodyParser = require('body-parser');
const conn = require('./database/database');
const app = express();

//Controllers
const CategoriesController = require('./controllers/CategoriesController');
const ArticlesController = require('./controllers/ArticlesController');
const UsersController = require('./controllers/UsersController');

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
            res.render('index', {page: parseInt(page), next, articles, categories});
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
