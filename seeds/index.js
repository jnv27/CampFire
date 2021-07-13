const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { findOne } = require('../models/user');
const User = require('../models/user');
const cities = require('./cities');
const {descriptors, places} = require('./seedhelper');


mongoose.connect('mongodb://localhost:27017/camp-fire',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected');
});

const seedDB = async()=>{
    await Campground.deleteMany({});
    await Review.deleteMany({});
    const user = await User.findOne({username: 'Aniket'});
    for(let i = 0;i<20;++i){
        let ind = Number(Math.floor(Math.random()*descriptors.length));
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: user._id,
            title: `${descriptors[ind]} ${places[ind]}`,
            location: `${cities[i].city} , ${cities[i].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                     cities[i].longitude,
                     cities[i].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/chessking/image/upload/v1619098778/CampFire/camp2_y174t5.jpg',
                    filename: 'CampFire/camp2_y174t5'
                },
                {
                    url: 'https://res.cloudinary.com/chessking/image/upload/v1619099036/CampFire/camp1_q81wlb.jpg',
                    filename: 'CampFire/camp1_q81wlb'
                }
            ]
        });
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});

