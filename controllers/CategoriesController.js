const express = require('express');
const router = express.Router();
const Category = require('../models/CategoryModel');
const slugify = require('slugify');

router.get('/admin/categories', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', {categories});
    })
});

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new');
});

router.post('/admin/categories/save', (req, res) => {
    var {title, id} = req.body;
    
    if(!title)
        return res.redirect('/admin/categories/new');
    
    Category.upsert({
        id,
        title,
        slug: slugify(title).toLowerCase()
    }).then(() => {
        res.redirect("/admin/categories");
    });
});

router.get('/admin/categories/edit/:id', (req, res) => {
    const {id} = req.params;

    Category.findByPk(id).then(category => {
        if(!category || isNaN(id))
            return res.redirect('/admin/categories');
        
        res.render('admin/categories/edit', {category});
    }).catch(error => {
        res.redirect('/admin/categories');
    });
});

router.post('/admin/categories/delete', (req, res) => {
    const {id} = req.body;

    //Not ID ou Not a Number
    if(!id)
        return res.redirect('/admin/categories');
    
    Category.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories');
    });
});

module.exports = router;