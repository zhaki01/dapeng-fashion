// routes/historyRoutes.js
// 路由：浏览历史记录
// 该文件定义了与浏览历史记录相关的路由
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const BrowsingHistory = require("../models/BrowsingHistory");
const Product = require("../models/Product");

// 保存浏览记录
router.post("/view", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({ message: "产品不存在" });
    }
    const record = new BrowsingHistory({
      userId: req.user._id,
      productId: req.body.productId,
    });
    const savedRecord = await record.save();
    console.log("✅ 浏览记录已保存:", savedRecord);
    res.status(201).json({ message: "浏览记录已保存", record: savedRecord });
  } catch (error) {
    console.error("❌ 浏览记录保存失败:", error);
    res.status(500).json({ message: "保存失败", error: error.message });
  }
});

// 获取指定用户的浏览记录（支持管理员查询其他用户记录）
router.get("/", protect, async (req, res) => {
  try {
    const queryUserId = req.query.userId ? req.query.userId : req.user._id;
    if (req.query.userId && req.user.role !== "管理员") {
      return res.status(403).json({ message: "无权限查询其他用户的浏览记录" });
    }
    const records = await BrowsingHistory.find({
      userId: queryUserId,
    }).populate({
      path: "productId",
      select: "name price images collections",
    });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

module.exports = router;
