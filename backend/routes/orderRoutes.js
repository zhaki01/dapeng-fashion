// orderRoutes.js
// 订单路由
// 该路由用于处理与订单相关的请求
const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 修改后的接口：获取指定用户的所有订单
router.get("/my-orders", protect, async (req, res) => {
  try {
    // 如果 query 中传入 userId，则查询该用户订单，否则查询当前登录用户订单
    const userId = req.query.userId ? req.query.userId : req.user._id;
    // 如果传入 userId 且当前用户不是管理员，则拒绝
    if (req.query.userId && req.user.role !== "管理员") {
      return res.status(403).json({ message: "无权限查询其他用户订单" });
    }
    const orders = await Order.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 获取订单详情（保持原有）
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) {
      return res.status(404).json({ message: "订单未找到" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

module.exports = router;
