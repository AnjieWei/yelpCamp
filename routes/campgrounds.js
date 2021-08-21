const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const Campground = require('../models/campground');
const campground = require('../controller/campground');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

router.route('/')
  .get(campground.index)
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.create));

router.get('/homepage', (req, res) => {
  res.render('home');
})

router.get('/new', isLoggedIn, campground.newFormRender);
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.editFormRender));

router.route('/:id')
  .get(catchAsync(campground.detail))
  .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.update))
  .delete(isLoggedIn, isAuthor, catchAsync(campground.delete));



module.exports = router;