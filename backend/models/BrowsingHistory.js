// File: backend/models/BrowsingHistory.js
// BrowsingHistory.js
// 浏览历史模型
// 该模型用于存储用户浏览的商品历史记录
// 引入所需模块
const mongoose = require("mongoose");

const browsingHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const BrowsingHistory = mongoose.model(
  "BrowsingHistory",
  browsingHistorySchema
);

module.exports = BrowsingHistory;
