const express = require('express');
const router = express.Router();
const Category = require('../models/CategoryModel');
const Article = require('../models/ArticleModel');
const adminAuth = require('../middlewares/adminAuth');
const slugify = require('slugify');

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles});
    });
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new',{categories});
    })
});

router.post("/admin/articles/save", adminAuth, (req, res) => {
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

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    const {id} = req.params;

    Article.findByPk(id).then(article => {
        if(!article || isNaN(id))
            return res.redirect('/admin/articles');
        
        Category.findAll().then(categories => {
            res.render('admin/articles/edit',{article,categories});
        });
    }).catch(error => {
        res.redirect('/admin/articles');
    });
});

router.post('/admin/articles/delete', adminAuth, (req, res) => {
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