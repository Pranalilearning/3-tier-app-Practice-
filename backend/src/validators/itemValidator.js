const { body } = require("express-validator");

const createItemValidation = [
  body("name")
    .exists({ checkFalsy: false })
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
];

module.exports = {
  createItemValidation,
};