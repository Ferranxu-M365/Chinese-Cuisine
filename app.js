// ENV VARIABLES
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// CORE MODULES
const path = require('path');
// UTILS
const ExpressError = require('./utils/ExpressError');
// EXPRESS APP
const express = require('express');
const app = express();
// MONGOOSE
const mongoose = require('mongoose');
// METHOD-OVERRIDE
const methodOverride = require('method-override');
// EXPRESS ENGINE EJS-MATE
const engine = require('ejs-mate');
// FLASH NOTIFICATIONS
const flash = require('connect-flash');
// SESSIONS
const session = require('express-session');
// REDIS TO STORE SESSIONS
const redis = require ('redis');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
// PASSPORT (AUTHENTICATION)
const passport = require('passport');
const passportLocal = require('passport-local');
// REQUIRE ROUTERS
const dishRouter = require('./routes/dishes');
const reviewRouter = require('./routes/reviews');
const userRouter = require('./routes/users');
const aboutRouter = require('./routes/about');
// REQUIRE MODELS
const UserModel = require('./models/user');

// CONNECT TO THE MONGODB DATABASE
mongoose.connect('mongodb://localhost:27017/chinese-cuisine', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// SET EXPRESS TO USE EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);

// STATIC RESOURCES
app.use(express.static(path.join(__dirname, 'public')));

// SET A MIDDLEWARE TO PARSE FORMS AND OVERRIDE METHODS
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// SESSION CONFIGURATION
const sessionConfig = {
    store: new RedisStore({ client: redisClient}),
    secret: 'aVerySecretSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

// CONFIG AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// USE FLASH
app.use(flash());

// SET LOCALS
app.use((req, res, next) => {
    res.locals.messages = {
        success: req.flash('success'),
        error: req.flash('error')
    };
    res.locals.currentUser = req.user;
    res.locals.url = req.url;
    next();
});

// HOME
app.get('/', (req, res) => {
    res.render('home');
});

// USERS
app.use('/', userRouter);

// DISHES
app.use('/dishes', dishRouter);

// DISH REVIEWS
app.use('/dishes/:id/reviews', reviewRouter);

// ABOUT PAGE
app.use('/about', aboutRouter);

// ANY REQUEST
app.all('*', (req, res, next) => {
    next(new ExpressError('404', 'NOT FOUND!'));
});

// HANDLING ERRORS
app.use((err, req, res, next) => {
    const { statusCode = '500', message = 'Something went wrong.', stack = '' } = err;
    res.status(statusCode).render('error', { statusCode, message, stack });
});

// START EXPRESS TO LISTEN
app.listen(8080, () => {
    console.log('Server is listening...');
});