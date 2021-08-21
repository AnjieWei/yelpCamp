const BaseJoi = require('joi');
const sanitizeHtml = require ('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
      'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
      escapeHTML: {
          validate(value, helpers) {
              const clean = sanitizeHtml(value, {
                  allowedTags: [],
                  allowedAttributes: {},
              });
              if (clean !== value) return helpers.error('string.escapeHTML', { value })
              return clean;
          }
      }
  }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
      name: Joi.string().required().escapeHTML(),
      price: Joi.number().min(0).required().min(),
      // image: Joi.string().required(),
      description: Joi.string().required().escapeHTML(),
      location: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required().max(5),
    rating: Joi.number().required()
  }).required()
})