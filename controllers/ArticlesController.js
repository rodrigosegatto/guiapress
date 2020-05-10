const express = require('express');
const router = express.Router();
const Category = require('../models/CategoryModel');
const Article = require('../models/ArticleModel');
const slugify = require('slugify');

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles});
    });
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new',{categories});
    })
});

router.post("/admin/articles/save", (req, res) => {
    const {title, body, categoryId, id} = req.body;
    
    if(!title || !body || !categoryId)
        return res.redirect('/admin/articles/new');
        
    Article.upsert({
        id,
        title,
        slug: slugify(title).toLowerCase(),
        body,
        categoryId
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

router.post('/admin/articles/delete', (req, res) => {
    const {id} = req.body;

    //Not ID ou Not a Number
    if(!id)
        return res.redirect('/admin/articles');
    
    Article.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles');
    });
});

module.exports = router;