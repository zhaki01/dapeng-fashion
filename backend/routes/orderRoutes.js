// orderRoutes.js
// 📁 订单接口模块
// 用途：处理用户订单相关的请求，例如查看自己的订单列表和查看某个订单详情

const express = require("express");
const Order = require("../models/Order"); // 引入订单数据模型
const { protect } = require("../middleware/authMiddleware"); // 引入用户认证中间件（必须登录）

const router = express.Router(); // 创建路由对象

// 🟡 路由1：获取用户的所有订单列表
// 方法：GET
// 地址：/api/orders/my-orders
// 描述：返回当前用户的订单列表（管理员可以查看其他用户的订单）
router.get("/my-orders", protect, async (req, res) => {
  try {
    // 获取用户ID：如果地址中带了 userId 参数，就查指定用户；否则默认查当前登录用户
    const userId = req.query.userId ? req.query.userId : req.user._id;

    // 安全校验：如果请求中带了 userId 且当前用户不是管理员，不允许查询
    if (req.query.userId && req.user.role !== "管理员") {
      return res.status(403).json({ message: "无权限查询其他用户订单" });
    }

    // 查询数据库中该用户的订单，并按时间倒序排列（最近的在前）
    const orders = await Order.find({ user: userId }).sort({
      createdAt: -1,
    });

    // 返回订单列表
    res.json(orders);
  } catch (error) {
    // 出现异常时返回服务器错误
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 🟡 路由2：获取订单详情
// 方法：GET
// 地址：/api/orders/:id
// 描述：根据订单ID获取订单详细信息（如用户信息、商品清单等）
router.get("/:id", protect, async (req, res) => {
  try {
    // 根据路径参数中的订单ID查找订单，同时把关联的用户信息一起查出（只查 name 和 email）
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    // 如果订单不存在，返回 404 错误
    if (!order) {
      return res.status(404).json({ message: "订单未找到" });
    }

    // 返回订单数据
    res.json(order);
  } catch (error) {
    // 出现异常时返回服务器错误
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 导出该路由模块，供主程序调用
module.exports = router;
