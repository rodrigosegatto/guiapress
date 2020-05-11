const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {users});
    })
});

router.get("/admin/users/new", (req, res) => {
    res.render('admin/users/new');
});

router.post("/admin/users/save", (req, res) => {
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

module.exports = router;

