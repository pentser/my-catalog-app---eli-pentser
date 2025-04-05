const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        user_name: Joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.min': 'שם המשתמש חייב להכיל לפחות 3 תווים',
                'string.max': 'שם המשתמש יכול להכיל עד 30 תווים',
                'any.required': 'שם משתמש הוא שדה חובה'
            }),
        first_name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'שם פרטי חייב להכיל לפחות 2 תווים',
                'string.max': 'שם פרטי יכול להכיל עד 50 תווים',
                'any.required': 'שם פרטי הוא שדה חובה'
            }),
        last_name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'שם משפחה חייב להכיל לפחות 2 תווים',
                'string.max': 'שם משפחה יכול להכיל עד 50 תווים',
                'any.required': 'שם משפחה הוא שדה חובה'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'כתובת אימייל לא תקינה',
                'any.required': 'כתובת אימייל היא שדה חובה'
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                'string.min': 'הסיסמה חייבת להכיל לפחות 6 תווים',
                'any.required': 'סיסמה היא שדה חובה'
            }),
        birth_date: Joi.date()
            .max('now')
            .required()
            .messages({
                'date.max': 'תאריך הלידה חייב להיות בעבר',
                'any.required': 'תאריך לידה הוא שדה חובה'
            }),
        preferences: Joi.object({
            page_size: Joi.number()
                .min(1)
                .max(100)
                .default(12)
                .messages({
                    'number.min': 'גודל העמוד חייב להיות לפחות 1',
                    'number.max': 'גודל העמוד יכול להיות עד 100'
                })
        }).default({ page_size: 12 })
    });

    return schema.validate(data);
};

const updateProfileValidation = (data) => {
    const schema = Joi.object({
        first_name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'שם פרטי חייב להכיל לפחות 2 תווים',
                'string.max': 'שם פרטי יכול להכיל עד 50 תווים',
                'any.required': 'שם פרטי הוא שדה חובה'
            }),
        last_name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'שם משפחה חייב להכיל לפחות 2 תווים',
                'string.max': 'שם משפחה יכול להכיל עד 50 תווים',
                'any.required': 'שם משפחה הוא שדה חובה'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'כתובת אימייל לא תקינה',
                'any.required': 'כתובת אימייל היא שדה חובה'
            }),
        birth_date: Joi.date()
            .max('now')
            .required()
            .messages({
                'date.max': 'תאריך הלידה חייב להיות בעבר',
                'any.required': 'תאריך לידה הוא שדה חובה'
            }),
        preferences: Joi.object({
            page_size: Joi.number()
                .min(1)
                .max(100)
                .default(12)
                .messages({
                    'number.min': 'גודל העמוד חייב להיות לפחות 1',
                    'number.max': 'גודל העמוד יכול להיות עד 100'
                })
        }).default({ page_size: 12 })
    });

    return schema.validate(data);
};

module.exports = {
    registerValidation,
    updateProfileValidation
}; 