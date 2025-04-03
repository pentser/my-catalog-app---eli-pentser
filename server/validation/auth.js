const Joi = require('joi');

const registerSchema = Joi.object({
    user_name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.empty': 'שם משתמש הוא שדה חובה',
            'string.min': 'שם משתמש חייב להכיל לפחות 3 תווים',
            'string.max': 'שם משתמש יכול להכיל עד 30 תווים'
        }),

    password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
        .messages({
            'string.empty': 'סיסמה היא שדה חובה',
            'string.min': 'סיסמה חייבת להכיל לפחות 6 תווים',
            'string.max': 'סיסמה יכולה להכיל עד 30 תווים',
            'string.pattern.base': 'סיסמה חייבת להכיל רק אותיות באנגלית ומספרים'
        }),

    first_name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'שם פרטי הוא שדה חובה',
            'string.min': 'שם פרטי חייב להכיל לפחות 2 תווים',
            'string.max': 'שם פרטי יכול להכיל עד 50 תווים'
        }),

    last_name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'שם משפחה הוא שדה חובה',
            'string.min': 'שם משפחה חייב להכיל לפחות 2 תווים',
            'string.max': 'שם משפחה יכול להכיל עד 50 תווים'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'אימייל הוא שדה חובה',
            'string.email': 'אנא הזן כתובת אימייל תקינה'
        }),

    birth_date: Joi.date()
        .max('now')
        .required()
        .messages({
            'date.base': 'אנא הזן תאריך תקין',
            'date.max': 'תאריך הלידה לא יכול להיות בעתיד',
            'any.required': 'תאריך לידה הוא שדה חובה'
        }),

    isAdmin: Joi.boolean()
        .default(false)
});

const loginSchema = Joi.object({
    user_name: Joi.string()
        .required()
        .messages({
            'string.empty': 'שם משתמש הוא שדה חובה'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'סיסמה היא שדה חובה'
        })
});

module.exports = {
    registerSchema,
    loginSchema
}; 