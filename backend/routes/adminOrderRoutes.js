// adminOrderRoutes包含了管理员对订单的操作路由
// 该文件定义了获取所有订单、更新订单状态和删除订单的路由
// 这些路由都需要管理员权限才能访问
const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @路由 GET /api/admin/orders
// @描述 获取所有订单（仅管理员）
// @权限 私有 / 管理员
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 PUT /api/admin/orders/:id
// @描述 更新订单状态
// @权限 私有 / 管理员
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");
    if (order) {
      order.status = req.body.status || order.status;
      order.isDelivered =
        req.body.status === "已送达" ? true : order.isDelivered;
      order.deliveredAt =
        req.body.status === "已送达" ? Date.now() : order.deliveredAt;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "订单未找到" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 DELETE /api/admin/orders/:id
// @描述 删除订单
// @权限 私有 / 管理员
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: "订单已删除" });
    } else {
      res.status(404).json({ message: "订单未找到" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

module.exports = router;
