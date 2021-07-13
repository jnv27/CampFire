const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn,isAuthor,validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(campgrounds.index) // index route
    .post(isLoggedIn, upload.array('image'), validateCampground, campgrounds.createNewCamp) // create new campground
    // .post(upload.array('image'), (req,res) => {
    //     console.log(req.body,req.files)
    //     res.send("It worked")
    // });

router.get('/new',isLoggedIn, campgrounds.renderNew); // render new campground

router.route('/:id')
    .get( campgrounds.showCampground) // render show page
    .put( isLoggedIn, isAuthor, upload.array('image'), validateCampground, campgrounds.updateCampground) // update camground route
    .delete( isLoggedIn, isAuthor, campgrounds.deleteCampground) // delete camground route

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditCamp); // render edit page

module.exports = router;