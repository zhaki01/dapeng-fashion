// Subscriber.js
// 订阅者模型
// 该模型用于存储用户的订阅信息，例如订阅邮件通知等

// 引入 mongoose，用于定义 MongoDB 数据模型
const mongoose = require("mongoose");

// 定义订阅者的数据结构（Schema）
const subscriberSchema = new mongoose.Schema({
  // 用户的邮箱地址
  email: {
    type: String, // 数据类型为字符串
    required: true, // 必填项，不能为空
    unique: true, // 必须唯一，不能重复提交相同邮箱
    trim: true, // 自动去除首尾空格
    lowercase: true, // 自动转为小写，确保统一性
  },

  // 用户订阅的时间
  subscribedAt: {
    type: Date, // 数据类型为日期
    default: Date.now, // 默认值为当前时间
  },
});

// 导出模型，供其他模块使用（如订阅接口调用数据库）
module.exports = mongoose.model("Subscriber", subscriberSchema);
