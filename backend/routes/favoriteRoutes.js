// File: backend/routes/favoriteRoutes.js
// favoriteRoutes.js
// 收藏夹路由
// 该路由用于处理与用户收藏夹相关的请求

// favoriteRoutes.js
// module.exports = router;
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

// 添加收藏（必须登录）
router.post("/", protect, async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: "缺少商品ID" });
  try {
    const exists = await Favorite.findOne({
      user: req.user._id,
      product: productId,
    });
    if (exists) return res.status(400).json({ message: "该商品已收藏" });
    const favorite = new Favorite({
      user: req.user._id,
      product: productId,
    });
    const savedFavorite = await favorite.save();
    res.status(201).json(savedFavorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 取消收藏
router.delete("/:id", protect, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    if (!favorite) return res.status(404).json({ message: "收藏记录不存在" });
    if (favorite.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "无权限删除该收藏" });
    await favorite.deleteOne();
    res.json({ message: "收藏已取消" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 修改后的接口：获取指定用户的收藏列表
router.get("/", protect, async (req, res) => {
  try {
    const queryUserId = req.query.userId ? req.query.userId : req.user._id;
    if (req.query.userId && req.user.role !== "管理员") {
      return res.status(403).json({ message: "无权限查询其他用户收藏" });
    }
    const favorites = await Favorite.find({ user: queryUserId }).populate({
      path: "product",
      select: "name price images collections",
    });
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 获取推荐产品接口（保持不变）
router.get("/recommendations", protect, async (req, res) => {
  try {
    const favoriteRecords = await Favorite.find({
      user: req.user._id,
    }).populate({
      path: "product",
      select: "collections",
    });
    const historyRecords = await require("../models/BrowsingHistory")
      .find({
        userId: req.user._id,
      })
      .populate({
        path: "productId",
        select: "collections",
      });
    const Order = require("../models/Order");
    const orders = await Order.find({ user: req.user._id });

    let styleCount = {};
    favoriteRecords.forEach((fav) => {
      const coll = fav.product?.collections;
      if (coll) {
        styleCount[coll] = (styleCount[coll] || 0) + 3;
      }
    });
    historyRecords.forEach((record) => {
      const coll = record.productId?.collections;
      if (coll) {
        styleCount[coll] = (styleCount[coll] || 0) + 1;
      }
    });
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        styleCount[item.category] = (styleCount[item.category] || 0) + 2;
      });
    });

    const preferredStyles = Object.entries(styleCount)
      .sort((a, b) => b[1] - a[1])
      .map(([style]) => style)
      .slice(0, 3);
    const targetStyles =
      preferredStyles.length > 0
        ? preferredStyles
        : ["基础系列", "都市系列", "运动系列"];
    const Product = require("../models/Product");
    const recommendedProducts = await Product.find({
      collections: { $in: targetStyles },
    }).limit(8);
    res.json(recommendedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "推荐生成失败", error: error.message });
  }
});

module.exports = router;
