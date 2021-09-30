const { required } = require("joi");
const Joi = require("joi");

// Register Validation  註冊相關格式
const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data); // 直接 return schema.validate(data)的結果
};

// Login Validation  登入相關格式
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

// article insert Validation
const articleValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    content: Joi.string().min(10).max(1000).required(),
    author: Joi.string().required(),
  });
  return schema.validate(data);
};

const commentValidation = (data) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    text: Joi.string().min(1).max(100).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.articleValidation = articleValidation;
module.exports.commentValidation = commentValidation;
