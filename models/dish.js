const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const DishSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    image: {
        filename: {type: String, required: false},
        path: {type: String, required: false}
    },
    author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

DishSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Dish', DishSchema);