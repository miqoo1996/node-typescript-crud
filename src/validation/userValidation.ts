import { body } from 'express-validator'

const optionalName = [
    body('name').isString().withMessage("Not a valid string").optional(),
];

const userFields = [
    body('firstName').isString().withMessage("Not a valid string").isLength({ min: 2 }),
    body('lastName').isString().isLength({ min: 2 }),
    body('age').isInt().isLength({ min: 1 }),
];

export {
    optionalName,
    userFields
};