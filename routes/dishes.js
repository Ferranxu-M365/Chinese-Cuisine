const express = require('express');
const router = express.Router();
const AsyncHandler = require('../utils/AsyncHandler');
// UPLOAD FILES WITH MULTER TO CLOUDINARY
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
// REQUIRE CONTROLLER
const dishes = require('../controllers/dishes');
// REQUIRE MIDDLEWARES
const { isLoggedIn, validateDish, isAuthor } = require('../middleware');

// GET DISHES AND CREATE DISH
router.route('/')
    .get(AsyncHandler(dishes.getDishes))
    .post(isLoggedIn, upload.array('image', 1), validateDish, AsyncHandler(dishes.newDish));

// RENDER DISHES
router.route('/chinesedishes')
    .get(AsyncHandler(dishes.renderDishes));

// RENDER FORM: CREATE A DISH
router.route('/new')
    .get(isLoggedIn, dishes.renderNewDishForm);

// GET DISH, EDIT A DISH AND DELETE A DISH
router.route('/:id')
    .get(AsyncHandler(dishes.getAndRenderDish))
    .patch(isLoggedIn, isAuthor, upload.array('image', 1), validateDish, AsyncHandler(dishes.editDish))
    .delete(isLoggedIn, isAuthor, AsyncHandler(dishes.deleteDish));

// FORM: EDIT A DISH
router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, AsyncHandler(dishes.renderEditForm));

module.exports = router;