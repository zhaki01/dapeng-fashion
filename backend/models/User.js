// User.js
// 用户模型
// 该模型用于存储用户的基本信息
const mongoose = require("mongoose"); // 引入 Mongoose，用于连接 MongoDB 数据库
const bcrypt = require("bcryptjs"); // 引入 bcryptjs，用于加密用户密码
// const jwt = require("jsonwebtoken"); // (可选) 引入 jsonwebtoken，用于生成 JWT 令牌（未使用）

// 定义用户的数据库 Schema（数据结构）
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // 用户名类型为字符串
      required: [true, "请输入用户名"], // 必须提供用户名，否则报错
      trim: true, // 自动去掉前后空格
    },
    email: {
      type: String, // 邮箱类型为字符串
      required: [true, "请输入电子邮箱"], // 必须提供邮箱，否则报错
      unique: true, // 确保邮箱唯一，不能重复
      trim: true, // 自动去掉前后空格
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // 正则表达式，检查邮箱格式是否正确
        "请输入有效的电子邮箱地址", // 如果格式不正确，返回错误信息
      ],
    },
    password: {
      type: String, // 密码类型为字符串
      required: [true, "请设置密码"], // 必须提供密码，否则报错

      minlength: 6, // 密码最少 6 个字符
    },
    role: {
      type: String, // 角色类型为字符串
      enum: ["客户", "管理员"], // 只能是 "customer"（普通用户）或 "admin"（管理员）
      // enum: ["customer", "admin"], // 只能是 "customer"（普通用户）或 "admin"（管理员）
      default: "客户", // 默认用户是普通用户
      // default: "customer", // 默认用户是普通用户
    },
  },
  {
    timestamps: true, // 自动添加 `createdAt` 和 `updatedAt` 时间字段
  }
);

// **在保存用户前，加密密码**
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // 如果密码没有修改，就跳过加密步骤
  }
  const salt = await bcrypt.genSalt(10); // 生成一个加密 "盐"，增加密码安全性
  this.password = await bcrypt.hash(this.password, salt); // 用 bcrypt 加密密码
  next(); // 继续执行保存操作
});

// **定义一个方法：用于比较用户输入的密码和数据库里的加密密码**
// userSchema.methods.matchPasswords = async function (password) {
//   return await bcrypt.compare(password, this.password);
//   // bcrypt.compare(输入的密码, 数据库里的加密密码)
//   // 如果匹配，返回 true；如果不匹配，返回 false
// };
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// **导出用户模型**
module.exports = mongoose.model("User", userSchema);
// `User` 是模型的名字，MongoDB 会自动转换为 `users` 这个集合
