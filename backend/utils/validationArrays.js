const { check } = require('express-validator');
const { handleValidationErrors } = require('./validation');


const validateSpotCreate = [
    check('address')
      .isString()
      .withMessage('Street address is required')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required')
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .isString()
      .withMessage('City is required')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required')
      .isString()
      .withMessage('State is required')
      .notEmpty()
      .withMessage('State is required'),
    check('country')
      .isString()
      .withMessage('Country is required')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .custom(value => {
        if(value < -90 || value > 90){
            return false
        }else {
            return true
        }
      })
      .withMessage('Latitude must be within -90 and 90')
      .exists({ checkFalsy: true })
      .withMessage('Latitude must be within -90 and 90')
      .notEmpty()
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .custom(value => {
        if(value < -180 || value > 180){
            return false
        }else {
            return true
        }
      })
      .withMessage('Longitude must be within -180 and 180')
      .exists({ checkFalsy: true })
      .withMessage('Longitude must be within -180 and 180')
      .notEmpty()
      .withMessage('Longitude must be within -180 and 180'),
    check('name')
      .exists({ checkFalsy: true })
      .withMessage('Name must be less than 50 characters')
      .notEmpty()
      .withMessage('Name must be less than 50 characters')
      .isString()
      .withMessage('Name must be less than 50 characters')
      .isLength({ max: 49 })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .isString()
      .withMessage('Description is required')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .isInt({min: 0})
      .withMessage('Price per day must be a positive number')
      .exists({ checkFalsy: true })
      .withMessage('Price per day must be a positive number'),
    handleValidationErrors
  ];

  const validateSpotEdit = [
    check('address')
      .optional()
      .isString()
      .withMessage('Street address is required')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required')
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .optional()
      .isString()
      .withMessage('City is required')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .optional()
      .exists({ checkFalsy: true })
      .withMessage('State is required')
      .isString()
      .withMessage('State is required')
      .notEmpty()
      .withMessage('State is required'),
    check('country')
      .optional()
      .isString()
      .withMessage('Country is required')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .optional()
      .custom(value => {
        if(value < -90 || value > 90){
            return false
        }else {
            return true
        }
      })
      .withMessage('Latitude must be within -90 and 90')
      .exists({ checkFalsy: true })
      .withMessage('Latitude must be within -90 and 90')
      .notEmpty()
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .optional()
      .custom(value => {
        if(value < -180 || value > 180){
            return false
        }else {
            return true
        }
      })
      .withMessage('Longitude must be within -180 and 180')
      .exists({ checkFalsy: true })
      .withMessage('Longitude must be within -180 and 180')
      .notEmpty()
      .withMessage('Longitude must be within -180 and 180'),
    check('name')
      .optional()
      .exists({ checkFalsy: true })
      .withMessage('Name must be less than 50 characters')
      .notEmpty()
      .withMessage('Name must be less than 50 characters')
      .isString()
      .withMessage('Name must be less than 50 characters')
      .isLength({ max: 49 })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .optional()
      .isString()
      .withMessage('Description is required')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .optional()
      .isInt({min: 0})
      .withMessage('Price per day must be a positive number')
      .exists({ checkFalsy: true })
      .withMessage('Price per day must be a positive number'),
    handleValidationErrors
  ];

  const validateReviewCreate = [
    check('review')
      .isString()
      .withMessage('review text is required')
      .exists({ checkFalsy: true })
      .withMessage('review text is required')
      .notEmpty()
      .withMessage('review text is required')
      .isLength({min: 2, max: 300})
      .withMessage('review text is required'),
    check('stars')
      .isInt({min: 1, max: 5})
      .withMessage('Stars must be an integer from 1 to 5')
      .exists({ checkFalsy: true })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ];

  const validateReviewEdit = [
    check('review')
      .optional()
      .isString()
      .withMessage('review text is required')
      .exists({ checkFalsy: true })
      .withMessage('review text is required')
      .notEmpty()
      .withMessage('review text is required')
      .isLength({min: 2, max: 300})
      .withMessage('review text is required'),
    check('stars')
      .optional()
      .isInt({min: 1, max: 5})
      .withMessage('Stars must be an integer from 1 to 5')
      .exists({ checkFalsy: true })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ];

  const validateQuery = [
    check('page')
        .optional()
        .isInt({min: 1})
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({min: 1, max: 20})
        .withMessage('Size must be between 1 and 20'),
    check('maxLat')
        .optional()
        .custom(value => {
            if(value < -90 || value > 90 || isNaN(Number(value))){
                return false
            }else {
                return true
            }
          })
        .withMessage('Maximum latitude is invalid')
        .exists({ checkFalsy: true })
        .withMessage('Maximum latitude is invalid')
        .notEmpty()
        .withMessage('Maximum latitude is invalid'),
    check('minLat')
        .optional()
        .custom(value => {
            if(value < -90 || value > 90 || isNaN(Number(value))){
                return false
            }else {
                return true
            }
          })
        .withMessage('Minimum latitude is invalid')
        .exists({ checkFalsy: true })
        .withMessage('Minimum latitude is invalid')
        .notEmpty()
        .withMessage('Minimum latitude is invalid'),
    check('minLng')
        .optional()
        .custom(value => {
            if(value < -180 || value > 180 || isNaN(Number(value))){
                return false
            }else {
                return true
            }
          })
        .withMessage('Minimum longitude is invalid')
        .exists({ checkFalsy: true })
        .withMessage('Minimum longitude is invalid')
        .notEmpty()
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .optional()
        .custom(value => {
            if(value < -180 || value > 180 || isNaN(Number(value))){
                return false
            }else {
                return true
            }
          })
          .withMessage('Maximum longitude is invalid')
          .exists({ checkFalsy: true })
          .withMessage('Maximum longitude is invalid')
          .notEmpty()
          .withMessage('Maximum longitude is invalid'),
    check('minPrice')
        .optional()
        .isInt({min: 0})
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional()
        .isInt({min: 0})
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
  ]

  module.exports = {
    validateSpotCreate,
    validateReviewCreate,
    validateSpotEdit,
    validateReviewEdit,
    validateQuery
  };