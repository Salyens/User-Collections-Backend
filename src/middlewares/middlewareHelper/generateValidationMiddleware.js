const { check, validationResult } = require('express-validator');

function generateValidationMiddleware(fields, unit) {
    const fieldChecks = fields.map(field => {
        if (field.optional) {
            return check(field.name)
                .optional()
                .trim()
                .notEmpty()
                .withMessage(`The ${unit}'s ${field.name} shouldn't be empty`)
                .escape();
        } else {
            return check(field.name)
                .trim()
                .notEmpty()
                .withMessage(`The ${unit}'s ${field.name} shouldn't be empty`)
                .escape();
        }
    });

    const handleValidationResult = (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).send({ errors: errorMessages });
        }

        return next();
    };

    return [...fieldChecks, handleValidationResult];
}

module.exports = generateValidationMiddleware;
