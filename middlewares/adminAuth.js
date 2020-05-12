function adminAuth(req, res, next){
    if(!req.session.user)
        res.redirect('/admin/users/login');
    
    next(); //se logado, dar continuidade na requisição
}

module.exports = adminAuth;