const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload/', '/upload/w_200/')
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    name: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
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
}, opts);

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

CampgroundSchema.virtual('properties.popUpMarker').get(function(){
    return `<a href='/campgrounds/${this._id}'>${this.name}</a>
            <p>${this.description.substring(0, 20)}...</p>`
});

module.exports = mongoose.model('Campground', CampgroundSchema);