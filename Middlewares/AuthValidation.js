const Joi = require("joi");

const signupValidation = (req, res, next) => {
  console.log("Request body:", req.body);
  
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z ]+$/)
      .min(3)
      .max(100)
      .required()
      .messages({
        "string.empty": '"name" cannot be empty',
        "string.pattern.base": '"name" must only contain letters and spaces',
        "string.min": '"name" must be at least 3 characters long',
        "string.max": '"name" must not exceed 100 characters',
        "any.required": '"name" is required',
      }),

    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required()
      .custom((value, helpers) => {
        return value.toLowerCase().trim();
      })
      .messages({
        "string.empty": '"email" cannot be empty',
        "string.email": '"email" must be a valid email address',
        "any.required": '"email" is required',
      }),

    studentClass: Joi.string()
      .valid("6", "7", "8", "9", "10", "11", "12")
      .allow(null) // Optional
      .messages({
        "any.only": '"class" must be one of [6, 7, 8, 9, 10, 11, 12]',
      }),

    number: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required()
      .messages({
        "string.empty": '"number" cannot be empty',
        "string.pattern.base":
          '"number" must be a valid international phone number in E.164 format',
        "any.required": '"number" is required',
      }),

    dream: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z0-9 ]+$/)
      .min(3)
      .max(200)
      .required()
      .messages({
        "string.empty": '"dream" cannot be empty',
        "string.pattern.base":
          '"dream" must only contain letters, numbers, and spaces',
        "string.min": '"dream" must be at least 3 characters long',
        "string.max": '"dream" must not exceed 200 characters',
        "any.required": '"dream" is required',
      }),

    school: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z0-9 .,'-]+$/)
      .allow("", null) // Optional
      .messages({
        "string.pattern.base":
          '"school" must only contain letters, numbers, spaces, and common characters like . , \' -',
        "string.base": '"school" must be a valid string',
      }),

    password: Joi.string()
      .min(8)
      .max(50)
      .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      .required()
      .messages({
        "string.empty": '"password" cannot be empty',
        "string.min": '"password" must be at least 8 characters long',
        "string.max": '"password" must not exceed 50 characters',
        "string.pattern.base":
          '"password" must include at least one uppercase letter, one number, and one special character',
        "any.required": '"password" is required',
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const formattedErrors = error.details.map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": '"email" cannot be empty',
      "string.email": '"email" must be a valid email address',
      "any.required": '"email" is required',
    }),

    password: Joi.string().min(4).max(50).required().messages({
      "string.empty": '"password" cannot be empty',
      "string.min": '"password" must be at least 4 characters long',
      "string.max": '"password" must not exceed 50 characters',
      "any.required": '"password" is required',
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const formattedErrors = error.details.map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = {
  signupValidation,
  loginValidation,
};
