const mongoose = require('mongoose');
const DishModel = require('../models/dish');
const dishes = require('./dishes');

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

const deleteAndNew = async (array) => {
    await DishModel.deleteMany({});

    for(let dish of dishes){
        const dishElement = new DishModel({
            title: dish.title,
            description: dish.description,
            location: dish.location,
            image: {
                filename: "",
                path: dish.image
            },
            author: "61031270013ac442a093818b"
        })

        await dishElement.save();
    }

    mongoose.connection.close();
}

deleteAndNew(dishes);