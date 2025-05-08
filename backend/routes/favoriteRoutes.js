// File: backend/routes/favoriteRoutes.js
// 收藏夹相关路由，处理收藏商品、取消收藏、获取收藏列表、获取推荐商品等功能

const express = require("express");
const router = express.Router();

// 中间件：用于校验用户身份
const { protect } = require("../middleware/authMiddleware");

// 数据模型：收藏、商品
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

// @路由 POST /api/favorites
// @描述 添加收藏（用户点击收藏按钮）
// @权限 私有（必须登录）
router.post("/", protect, async (req, res) => {
  const { productId } = req.body;

  // 检查参数
  if (!productId) return res.status(400).json({ message: "缺少商品ID" });

  try {
    // 检查是否已收藏该商品
    const exists = await Favorite.findOne({
      user: req.user._id,
      product: productId,
    });

    if (exists) return res.status(400).json({ message: "该商品已收藏" });

    // 创建新的收藏记录
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

// @路由 DELETE /api/favorites/:id
// @描述 取消收藏（根据收藏ID删除）
// @权限 私有
router.delete("/:id", protect, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);

    // 收藏不存在
    if (!favorite) return res.status(404).json({ message: "收藏记录不存在" });

    // 只能删除自己的收藏
    if (favorite.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "无权限删除该收藏" });

    await favorite.deleteOne();
    res.json({ message: "收藏已取消" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 GET /api/favorites
// @描述 获取指定用户的收藏列表（支持管理员查看他人）
// @权限 私有
router.get("/", protect, async (req, res) => {
  try {
    // 如果传了 userId 参数，且当前用户是管理员，则查询该用户收藏
    // 否则只能查自己
    const queryUserId = req.query.userId ? req.query.userId : req.user._id;

    if (req.query.userId && req.user.role !== "管理员") {
      return res.status(403).json({ message: "无权限查询其他用户收藏" });
    }

    // 查询收藏并关联商品信息
    // const favorites = await Favorite.find({ user: queryUserId }).populate({
    //   path: "product",
    //   select: "name price images collections",
    // });

    // res.json(favorites);

    const favorites = await Favorite.find({ user: queryUserId }).populate({
      path: "product",
      select: "name price images collections",
    });

    const filteredFavorites = favorites.filter((fav) => fav.product !== null);

    res.json(filteredFavorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 GET /api/favorites/recommendations
// @描述 获取推荐商品（基于收藏、浏览、购买记录的风格偏好）
// @权限 私有
router.get("/recommendations", protect, async (req, res) => {
  try {
    // 1️⃣ 获取用户收藏的商品（权重3）
    const favoriteRecords = await Favorite.find({
      user: req.user._id,
    }).populate({
      path: "product",
      select: "collections", // 只取风格信息
    });

    // 2️⃣ 获取用户浏览记录（权重1）
    const BrowsingHistory = require("../models/BrowsingHistory");
    const historyRecords = await BrowsingHistory.find({
      userId: req.user._id,
    }).populate({
      path: "productId",
      select: "collections",
    });

    // 3️⃣ 获取用户订单（权重2）
    const Order = require("../models/Order");
    const orders = await Order.find({ user: req.user._id });

    // 4️⃣ 风格统计表：key 是风格，value 是分数
    let styleCount = {};

    // 收藏商品加权计分
    favoriteRecords.forEach((fav) => {
      const coll = fav.product?.collections;
      if (coll) {
        styleCount[coll] = (styleCount[coll] || 0) + 3;
      }
    });

    // 浏览记录加权计分
    historyRecords.forEach((record) => {
      const coll = record.productId?.collections;
      if (coll) {
        styleCount[coll] = (styleCount[coll] || 0) + 1;
      }
    });

    // 订单商品分类加权计分（使用 category 代替风格）
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        styleCount[item.category] = (styleCount[item.category] || 0) + 2;
      });
    });

    // 5️⃣ 排序得分前 3 的风格作为“用户偏好风格”
    const preferredStyles = Object.entries(styleCount)
      .sort((a, b) => b[1] - a[1]) // 降序排序
      .map(([style]) => style) // 提取风格名
      .slice(0, 3); // 只取前三

    // 如果没有偏好数据，返回默认推荐
    const targetStyles =
      preferredStyles.length > 0
        ? preferredStyles
        : ["基础系列", "都市系列", "运动系列"];

    // 6️⃣ 根据偏好风格查找推荐商品
    const recommendedProducts = await Product.find({
      collections: { $in: targetStyles },
    }).limit(8); // 限制推荐数量

    res.json(recommendedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "推荐生成失败", error: error.message });
  }
});

module.exports = router;
