// adminOrderRoutes包含了管理员对订单的操作路由
// 该文件定义了获取所有订单、更新订单状态和删除订单的路由
// 这些路由都需要管理员权限才能访问
// adminOrderRoutes.js

const express = require("express"); // 引入 Express 框架
const Order = require("../models/Order"); // 引入订单模型，用于数据库操作
const { protect, admin } = require("../middleware/authMiddleware");
// 引入身份验证中间件：protect（验证登录），admin（验证管理员身份）

const router = express.Router(); // 创建路由实例

// @路由 GET /api/admin/orders
// @描述 获取所有订单（仅管理员）
// @权限 私有 / 管理员
router.get("/", protect, admin, async (req, res) => {
  try {
    // 查询所有订单，并通过 populate 显示用户的 name 和 email 字段
    const orders = await Order.find({}).populate("user", "name email");

    // 返回订单数组给前端
    res.json(orders);
  } catch (error) {
    // 出现异常，打印错误并返回服务器错误信息
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 PUT /api/admin/orders/:id
// @描述 更新订单状态（如标记为“已送达”）
// @权限 私有 / 管理员
router.put("/:id", protect, admin, async (req, res) => {
  try {
    // 根据订单 ID 查找订单，并同时获取用户的 name 字段
    const order = await Order.findById(req.params.id).populate("user", "name");

    if (order) {
      // 更新订单状态（来自请求体中的 status 字段）
      order.status = req.body.status || order.status;

      // 如果状态是“已送达”，标记 isDelivered 为 true，并记录送达时间
      order.isDelivered =
        req.body.status === "已送达" ? true : order.isDelivered;

      order.deliveredAt =
        req.body.status === "已送达" ? Date.now() : order.deliveredAt;

      // 保存修改后的订单
      const updatedOrder = await order.save();

      // 返回更新后的订单数据
      res.json(updatedOrder);
    } else {
      // 如果找不到订单，返回 404
      res.status(404).json({ message: "订单未找到" });
    }
  } catch (error) {
    // 捕获并返回服务器错误
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 DELETE /api/admin/orders/:id
// @描述 删除订单（根据 ID）
// @权限 私有 / 管理员
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    // 根据订单 ID 查找订单
    const order = await Order.findById(req.params.id);

    if (order) {
      // 找到订单后执行删除操作
      await order.deleteOne();

      // 返回删除成功提示
      res.json({ message: "订单已删除" });
    } else {
      // 找不到订单时返回 404
      res.status(404).json({ message: "订单未找到" });
    }
  } catch (error) {
    // 捕获异常并返回服务器错误
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 导出该路由模块，供主应用程序使用
module.exports = router;
