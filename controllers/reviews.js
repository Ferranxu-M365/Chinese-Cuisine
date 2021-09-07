// REQUIRE MODELS
const ReviewModel = require('../models/review');
const DishModel = require('../models/dish');

// CREATE A REVIEW
module.exports.newReview = async (req, res, next) => {
    const { id } = req.params;
    const { reviewBody, reviewRating } = req.body

    const review = new ReviewModel({
        body: reviewBody,
        rating: reviewRating,
        author: req.user._id
    });

    const dish = await DishModel.findById(id);
    dish.reviews.push(review);

    await review.save();
    await dish.save();

    req.flash('success', 'Review Created');
    res.redirect(`/dishes/${id}`);
};

// DELETE A REVIEW
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await DishModel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await ReviewModel.findByIdAndDelete(reviewId);
    
    req.flash('success', 'Review Deleted');
    res.redirect(`/dishes/${id}`);
};