// User.js
// 用户模型
// 该模型用于存储用户的基本信息

const mongoose = require("mongoose"); // 引入 Mongoose，用于连接 MongoDB 数据库
const bcrypt = require("bcryptjs"); // 引入 bcryptjs，用于加密用户密码
// const jwt = require("jsonwebtoken"); // (可选) 引入 jsonwebtoken，用于生成 JWT 令牌（未使用）

// 定义用户的数据库 Schema（数据结构）
const userSchema = new mongoose.Schema(
  {
    // 用户名
    name: {
      type: String, // 用户名类型为字符串
      required: [true, "请输入用户名"], // 必填，未填时报错
      trim: true, // 自动去除前后空格
    },

    // 用户邮箱
    email: {
      type: String, // 邮箱类型为字符串
      required: [true, "请输入电子邮箱"], // 必填
      unique: true, // 邮箱必须唯一，不能重复注册
      trim: true, // 自动去除前后空格
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // 使用正则验证邮箱格式是否正确
        "请输入有效的电子邮箱地址", // 格式不正确时提示
      ],
    },

    // 用户密码
    password: {
      type: String, // 密码类型为字符串
      required: [true, "请设置密码"], // 必填
      minlength: 6, // 最少 6 个字符
    },

    // 用户角色：是客户还是管理员
    role: {
      type: String,
      enum: ["客户", "管理员"], // 仅允许“客户”或“管理员”
      // enum: ["customer", "admin"], // （英文版本，已注释）
      default: "客户", // 默认角色是客户
      // default: "customer",
    },
  },
  {
    timestamps: true, // 自动生成 createdAt 和 updatedAt 字段（时间戳）
  }
);

// **在保存用户前，加密密码**
userSchema.pre("save", async function (next) {
  // 如果密码字段没有被修改，直接跳过加密流程
  if (!this.isModified("password")) {
    return next();
  }

  // 生成加密“盐”（用于混淆密码，增强安全性）
  const salt = await bcrypt.genSalt(10);

  // 使用 bcrypt 对密码进行加密处理
  this.password = await bcrypt.hash(this.password, salt);

  // 继续执行保存操作
  next();
});

// **定义一个实例方法：验证输入密码是否与数据库中加密密码一致**
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
  // 返回布尔值：true 表示密码正确，false 表示错误
};

// **导出用户模型**
module.exports = mongoose.model("User", userSchema);
// 模型名称为 "User"，MongoDB 实际使用时会自动转换为 "users" 集合
