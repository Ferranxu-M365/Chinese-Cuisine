const joi = require('joi');

// DISHES: DEFINE JOI SCHEMA TO VALIDATE INPUT DATA
module.exports.joiDishSchema = joi.object().keys({
    title: joi.string().max(20).required(),
    description: joi.string().max(1000).required(),
    location: joi.string().max(50).required()
});

// REVIEW: DEFINE JOI SCHEMA TO VALIDATE INPUT DATA
module.exports.joiReviewSchema = joi.object().keys({
    reviewBody: joi.string().max(300).required(),
    reviewRating: joi.number().required()
});