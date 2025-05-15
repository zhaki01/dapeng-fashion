// routes/historyRoutes.js
// 📁 浏览记录路由模块
// 用于记录用户查看过哪些商品，并可供用户或管理员查看浏览记录

const express = require("express");
const router = express.Router(); // 创建路由对象

// 🔒 用户身份验证中间件（必须登录才能使用）
const { protect } = require("../middleware/authMiddleware");

// 🧾 数据模型：浏览记录 和 商品
const BrowsingHistory = require("../models/BrowsingHistory"); // 浏览记录模型
const Product = require("../models/Product"); // 商品模型

// 🟡 路由1：保存用户浏览的商品记录
// 方法：POST
// 地址：/api/history/view
// 描述：每当用户查看一个商品时，系统会保存这次浏览的记录
router.post("/view", protect, async (req, res) => {
  try {
    // 根据前端传来的 productId 查找商品
    const product = await Product.findById(req.body.productId);

    // 如果商品不存在，则返回错误
    if (!product) {
      return res.status(404).json({ message: "产品不存在" });
    }

    // 创建一个新的浏览记录
    const record = new BrowsingHistory({
      userId: req.user._id, // 当前登录用户ID
      productId: req.body.productId, // 被浏览的商品ID
    });

    // 保存到数据库
    const savedRecord = await record.save();

    // 打印并返回保存成功的信息
    console.log("✅ 浏览记录已保存:", savedRecord);
    res.status(201).json({ message: "浏览记录已保存", record: savedRecord });
  } catch (error) {
    // 出现错误时返回服务器错误信息
    console.error("❌ 浏览记录保存失败:", error);
    res.status(500).json({ message: "保存失败", error: error.message });
  }
});

// 🟡 路由2：获取用户的浏览记录
// 方法：GET
// 地址：/api/history
// 描述：用于查询某个用户的浏览记录（管理员可查询他人）
router.get("/", protect, async (req, res) => {
  try {
    // 如果带了 userId 参数，管理员可以查指定用户；否则默认查当前用户
    const queryUserId = req.query.userId ? req.query.userId : req.user._id;

    // 如果普通用户试图查询别人的记录，禁止操作
    if (req.query.userId && req.user.role !== "管理员") {
      return res.status(403).json({ message: "无权限查询其他用户的浏览记录" });
    }

    // 从数据库中查询浏览记录，并将每条记录的商品详情（名称、价格、图片、风格）一并返回
    const records = await BrowsingHistory.find({
      userId: queryUserId,
    }).populate({
      path: "productId", // 关联商品
      select: "name price images collections", // 指定要返回的商品字段
    });

    // 返回结果
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 导出该路由模块，供主程序调用
module.exports = router;
