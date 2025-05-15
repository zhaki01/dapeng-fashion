// File: backend/models/BrowsingHistory.js
// 浏览历史模型
// 该模型用于存储用户浏览的商品历史记录

// 引入 mongoose 模块，用于定义 MongoDB 数据模型
const mongoose = require("mongoose");

// 创建浏览历史的数据结构（Schema）
const browsingHistorySchema = new mongoose.Schema(
  {
    // 用户 ID：表示谁浏览了商品，引用自 User 用户表
    userId: {
      type: mongoose.Schema.Types.ObjectId, // 存储为 MongoDB 的 ObjectId 类型
      ref: "User", // 指向 User 表，用于建立关联
      required: true, // 必填项
    },
    // 商品 ID：表示浏览的是哪个商品，引用自 Product 商品表
    productId: {
      type: mongoose.Schema.Types.ObjectId, // 同样为 ObjectId 类型
      ref: "Product", // 指向 Product 表
      required: true, // 必填项
    },
    // 浏览时间：记录用户什么时候浏览的该商品
    viewedAt: {
      type: Date, // 数据类型为日期
      default: Date.now, // 默认值为当前时间
    },
  },
  {
    // 自动添加创建时间（createdAt）和更新时间（updatedAt）字段
    timestamps: true,
  }
);

// 使用定义好的 Schema 创建一个名为 BrowsingHistory 的模型
const BrowsingHistory = mongoose.model(
  "BrowsingHistory", // 模型名称（会自动映射为 MongoDB 中的集合名 browsinghistories）
  browsingHistorySchema // 绑定的数据结构
);

// 导出该模型，以便在其他文件中使用（如控制器中操作数据库）
module.exports = BrowsingHistory;
