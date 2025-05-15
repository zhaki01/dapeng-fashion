// Favorite model
// Favorite.js
// 收藏模型
// 该模型用于存储用户收藏的商品信息

// 引入 mongoose 模块，用于定义 MongoDB 数据结构
const mongoose = require("mongoose");

// 定义收藏的 Schema（数据结构）
const favoriteSchema = new mongoose.Schema(
  {
    // 用户 ID，指明是谁收藏的商品
    user: {
      type: mongoose.Schema.Types.ObjectId, // 使用 MongoDB 的 ObjectId 类型
      ref: "User", // 引用 User 表中的用户
      required: true, // 必填字段
    },

    // 商品 ID，指明收藏的是哪个商品
    product: {
      type: mongoose.Schema.Types.ObjectId, // 同样为 ObjectId 类型
      ref: "Product", // 引用 Product 表中的商品
      required: true, // 必填字段
    },

    // 收藏时间，默认设置为当前时间
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // timestamps 会自动添加 createdAt 和 updatedAt 字段
    timestamps: true,
  }
);

// 创建并导出 Favorite 模型，供控制器等模块调用
module.exports = mongoose.model("Favorite", favoriteSchema);
