const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.post = async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review (req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New review added!')
    res.redirect(`/campgrounds/${campground._id}`);
  }

module.exports.delete = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review){
      req.flash('error', 'Cannot find the review');
      return res.redirect(`/campgrounds/${id}`)
    }else{
      req.flash('success', 'Review deleted!');
      res.redirect(`/campgrounds/${id}`);
    }  
  }