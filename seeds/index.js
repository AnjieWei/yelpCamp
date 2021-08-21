const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected')
});

const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');

const sample = arr => arr[Math.floor(Math.random()*arr.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50 ; i++) {
        const random1000 = [Math.floor(Math.random()*1000)];
        const camp = new Campground ({
            author: '60f6eb79c2c74a3cac7f496a',
            name: `${sample(descriptors)} ${sample(places)}`,
            images: [
              {
                url: 'https://res.cloudinary.com/dxzggxiy6/image/upload/v1628421846/YelpCamp/s9b2dunstlt3gkjdk8c9.jpg',
                filename: 'camp1'
              },{
                url: 'https://res.cloudinary.com/dxzggxiy6/image/upload/v1628496373/YelpCamp/rahul-bhosale-yBgC-qVCxMg-unsplash_plf4wj.jpg',
                filename: 'camp2'
              }],
              geometry: {
                type: 'Point',
                coordinates: [ cities[random1000].longitude, cities[random1000].latitude ]
              },            
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vestibulum urna at iaculis ullamcorper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla ac purus quam. Suspendisse faucibus, libero nec dignissim tempor, enim augue lacinia est, a lacinia sem ante eu odio. Nulla sollicitudin pretium elit, faucibus venenatis nulla accumsan et. Proin quis aliquam purus, sed ultricies ipsum. Praesent finibus, diam eget mollis efficitur, massa felis pellentesque lectus, sed imperdiet est erat quis eros. Nullam diam quam, elementum sit amet suscipit ut, semper vel diam. Cras maximus nibh magna. Quisque auctor ex at justo mattis, nec varius nisl suscipit.',
            price:`${Math.floor(Math.random()*20)+10}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`});
        await camp.save();
    } 
}

seedDB();