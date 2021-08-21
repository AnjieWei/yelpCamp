const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const review = require('../controller/review');
const { validateReview, isLoggedIn, isAuthorReview} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(review.post))


router.delete('/:reviewId', isAuthorReview, catchAsync(review.delete))

module.exports = router;