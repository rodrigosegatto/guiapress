const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const adminAuth = require('../middlewares/adminAuth');
const bcrypt = require('bcryptjs');

router.get("/admin/users", adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {users});
    })
});

router.get("/admin/users/new", adminAuth, (req, res) => {
    res.render('admin/users/new');
});

router.post("/admin/users/save", adminAuth, (req, res) => {
    const {email, password, id} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    User.findOne({where: {email: email}}).then(user => {
        //Valida se já existe usuário com mesmo e-mail, para não cadastrar novamente
        if(user)
            return res.redirect('/admin/users')
        
        User.upsert({
            id,
            email,
            password: hash
        }).then(() => {
            res.redirect('/admin/users');
        }).catch((err) => {
            res.redirect('/admin/users');
        });
    });
});

router.get('/admin/users/login',(req, res) => {
    res.render('admin/users/login');
});

router.post('/admin/users/auth', (req, res) => {
    const {email, password} = req.body;
    User.findOne({where: {email: email}}).then(user => {
        if(!user)
            return res.redirect('/admin/users/login');

        const correctPass = bcrypt.compareSync(password,user.password);

        if(!correctPass)
            return res.redirect('/admin/users/login');
        
        req.session.user = {
            id: user.id,
            email: user.email
        }
        
        res.redirect('/admin/articles');
    });
});

router.get("/admin/users/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;

