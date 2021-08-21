const User = require('../models/user');

module.exports.registerRender = (req, res) => {
    res.render('users/register')
};

module.exports.loginRender = (req, res) => {
    res.render('users/login')
};

module.exports.register = async (req, res) => {
    try{
        const {username, email, password} = req.body;
        const user = new User ({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
    
}

module.exports.login = (req, res) => {
    const returnUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', 'Welcome Back!');
    res.redirect(returnUrl)
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Good bye!');
    res.redirect('/campgrounds')
}