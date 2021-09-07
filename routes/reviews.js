const express = require('express');
const router = express.Router({mergeParams: true});
const AsyncHandler = require('../utils/AsyncHandler');
// REQUIRE MIDDLEWARES
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
// REQUIRE CONTROLLERS
const reviews = require('../controllers/reviews');

// CREATE A REVIEW
router.route('/')
    .post(isLoggedIn, validateReview, AsyncHandler(reviews.newReview));

// DELETE A REVIEW
router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, AsyncHandler(reviews.deleteReview));

module.exports = router;