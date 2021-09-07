// REQUIRE MODELS
const UserModel = require('../models/user');

// REGISTER A USER: FORM
module.exports.renderRegisterForm = (req, res) => {
    res.render('./register');
};

// CREATE A USER
module.exports.newUser = async (req, res) => {
    try{
        const { email, username, password } = req.body;

        const user = new UserModel({email, username});
        const registeredUser = await UserModel.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to the Website!');
            res.redirect('/dishes/ChineseDishes');    
        });
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
};

// LOGIN A USER: FORM
module.exports.renderLogin = (req, res) => {
    res.render('./login');
};

// USER LOGIN
module.exports.login = async (req, res) => {
    const redirectUrl = req.session.returnTo || '/dishes/chinesedishes';
    delete req.session.returnTo;
    req.flash('success', 'Nice to see you here again!');
    res.redirect(redirectUrl);
};

// LOGOUT USER
module.exports.logout = (req, res, next) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/dishes/chinesedishes');
};