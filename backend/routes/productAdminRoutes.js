// productAdminRoutes.js
// 商品管理路由
// 该路由用于处理与商品相关的管理操作
const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @路由 GET /api/admin/products
// @描述 获取所有商品（仅限管理员）
// @权限 私有 / 管理员
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误，无法获取商品列表" });
  }
});

module.exports = router;
