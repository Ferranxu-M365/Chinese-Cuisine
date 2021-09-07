const { cloudinary } = require('../cloudinary');

// REQUIRE MODELS
const DishModel = require('../models/dish');

// GET DISHES
module.exports.getDishes = async (req, res) => {
    
    const dishes = await DishModel.find({}).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort({title: 'asc'});
    res.send(JSON.stringify(dishes));
};

// RENDER DISHES
module.exports.renderDishes = async (req, res) => {    
    res.render("dishes/index");
};

// GET AND RENDER THE DISH
module.exports.getAndRenderDish = async (req, res) => {
    const { id } = req.params;
    const dish = await DishModel.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if(!dish){
        req.flash('failed', "This dish doesn't exists");
        return res.redirect('/dishes');
    }
    res.render("dishes/show", { dish });
};

// RENDER FORM: CREATE A DISH
module.exports.renderNewDishForm = (req, res) => {
    res.render('dishes/new');
};

// CREATE A DISH
module.exports.newDish = async (req, res, next) => {
    const { name, description, location } = req.body;
    const userAuthor = req.user._id;

    let Dish = new DishModel({
        title: name,
        description: description,
        location: location,
        author: userAuthor,
        image: {
            filename: "noPhoto_ylfvnz",
            path: "https://res.cloudinary.com/dktrharsq/image/upload/v1630433974/Chinese-Cuisine/noPhoto_ylfvnz.jpg"
        }
    });

    if(req.files.length !== 0){
        Dish = new DishModel({
            title: name,
            description: description,
            location: location,
            author: userAuthor,
            image: {
                filename: req.files[0].filename,
                path: req.files[0].path
            }
        });   
    }
    
    await Dish.save();
    req.flash('success', 'Dish Created');
    res.redirect(`/dishes/${Dish._id}`);
};

// RENDER FORM: EDIT A DISH
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const dish = await DishModel.findById(id);

    res.render('dishes/edit', { dish });
};

// EDIT A DISH
module.exports.editDish = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, location, deleteImage } = req.body;
    const dishObject = {
        title: name,
        description,
        location
    }

    if(req.files.length === 0){
        if(typeof req.body.deleteImage !== 'undefined'){
            cloudinary.uploader.destroy(deleteImage);
            dishObject.image = {
                filename: "noPhoto_ylfvnz",
                path: "https://res.cloudinary.com/dktrharsq/image/upload/v1630433974/Chinese-Cuisine/noPhoto_ylfvnz.jpg"
            };
        }

        await DishModel.findByIdAndUpdate(id, dishObject);
    }else{
        dishObject.image = {
            filename: req.files[0].filename,
            path: req.files[0].path
        };

        const dishMongo = await DishModel.findById(id);
        if(dishMongo.image.filename !== 'noPhoto_ylfvnz'){
            cloudinary.uploader.destroy(dishMongo.image.filename);
        }

        await DishModel.findByIdAndUpdate(id, dishObject);
    }

    req.flash('success', 'Dish Edited');
    res.redirect(`/dishes/${id}`);
};

module.exports.deleteDish = async (req, res) => {
    const { id } = req.params;
    
    const dishMongo = await DishModel.findById(id);
    cloudinary.uploader.destroy(dishMongo.image.filename);
    
    await DishModel.findByIdAndDelete(id);

    req.flash('success', 'Dish Deleted');
    res.redirect('/dishes/ChineseDishes');
 };