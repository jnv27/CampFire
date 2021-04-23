const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { cloudinary } = require("../cloudinary");

module.exports.index = catchAsync(async (req,res)=>{
    let camps = await Campground.find({});
    res.render('campgrounds/index',{camps: camps});
})

module.exports.renderNew = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createNewCamp = catchAsync(async (req,res)=>{
    let camp = new Campground(req.body.camp);
    camp.images = req.files.map(f => ({url: f.path,filename: f.filename}));
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect('/campgrounds');
   
})

module.exports.showCampground = catchAsync(async (req,res) =>{
    const id = req.params.id;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    console.log(camp);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{camp});
})

module.exports.renderEditCamp = catchAsync(async (req,res) =>{
    const id = req.params.id;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit',{camp});
})

module.exports.updateCampground = catchAsync(async (req,res) =>{
    const camp = await Campground.findByIdAndUpdate(req.params.id,req.body.camp);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Campground updated !');
    res.redirect(`/campgrounds/${camp._id}`);
})

module.exports.deleteCampground = catchAsync(async (req,res) =>{
    const camp = await Campground.findByIdAndDelete(req.params.id);
    console.log('campground deleted');
    req.flash('success', 'Campground deleted!');
    res.redirect('/campgrounds');
})