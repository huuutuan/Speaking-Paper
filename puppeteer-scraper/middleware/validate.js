const { ValidationError } = require('../utils/errorers');

module.exports = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(d => d.message);
            return next(new ValidationError(errors.join(', ')));
        }

        req.query = value;
        next();
    };
};