const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
  };

module.exports.newFormRender = (req, res) =>{
    res.render('campgrounds/new');
  };

module.exports. detail = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    }).populate('author');
    if (!campground){
      req.flash('error', 'Cannot find the campground');
      return res.redirect('/campgrounds')
    }else{
      res.render('campgrounds/detail', { campground })
    }
};

module.exports.editFormRender = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground){
      req.flash('error', 'Cannot find the campground');
      return res.redirect('/campgrounds')
    }else{
      res.render('campgrounds/edit', { campground })
    }
};

module.exports.create = async (req, res, next) => {
    const campground = new Campground (req.body.campground);
    const geoData = await geocoder.forwardGeocode({
      query: campground.location,
      limit: 1
    }).send();
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'New campground added!');
    console.log(campground);
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.update = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
      for (let img of req.body.deleteImages){
        await cloudinary.uploader.destroy(img);
      }
      await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Campground updated!');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.delete = async (req, res, next)=>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Deleted!')
    res.redirect('/campgrounds')
}