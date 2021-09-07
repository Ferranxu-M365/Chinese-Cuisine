const ExpressError = require('./utils/ExpressError');
const AsyncHandler = require('./utils/AsyncHandler');
const { joiDishSchema, joiReviewSchema } = require('./joiSchemas');
const dishModel = require('./models/dish');
const reviewModel = require('./models/review');

// MIDDLEWARE TO CHECK LOGGED USER
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please login');
        return res.redirect('/login');
    }
    next();
};

// MIDDLEWARE DISH VALIDATION
module.exports.validateDish = (req, res, next) => {
    const { name, description, location } = req.body;

    // VALIDATE INPUT DATA
    const validation = joiDishSchema.validate({
        title: name,
        description,
        location
    });

    if(validation.error !== undefined){
        next(new ExpressError('400', validation.error.details[0].message));
    }else{
        next();
    }
};

// MIDDLEWARE REVIEW VALIDATION
module.exports.validateReview = (req, res, next) => {
    const { reviewRating, reviewBody } = req.body;

    const validation = joiReviewSchema.validate({
        reviewBody: reviewBody,
        reviewRating: reviewRating
    });

    if(validation.error !== undefined){
        next(new ExpressError('400', validation.error.details[0].message));
    }else{
        next();
    }
};

// MIDDLEWARE TO CHECK THE AUTHOR
module.exports.isAuthor = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const dish = await dishModel.findById(id);

    if(req.user._id.toString() !== dish.author.toString()){
        return next(new ExpressError('403', 'FORBIDDEN: You are not the author.'));
    }
    next();
});

// MIDDLEWARE TO CHECK THE REVIEW'S AUTHOR
module.exports.isReviewAuthor = AsyncHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await reviewModel.findById(reviewId);
    
    if(req.user._id.toString() !== review.author.toString()){
        return next(new ExpressError('403', 'FORBIDDEN: You are not the author.'));
    }
    next();
});