// checkoutRoutes包含了结账会话的所有路由，包括创建结账会话、支付结账会话、生成订单等功能
// 该文件使用了Express框架和Mongoose库来处理HTTP请求和与MongoDB数据库的交互
// checkoutRoutes.js

const express = require("express");
const Checkout = require("../models/Checkout"); // 结账模型，用于暂存待支付订单信息
const Cart = require("../models/Cart"); // 购物车模型，用于后续清空购物车
const Product = require("../models/Product"); // 商品模型（未使用但通常用于验证）
const Order = require("../models/Order"); // 订单模型，用于生成正式订单
const { protect } = require("../middleware/authMiddleware"); // 用户身份认证中间件

const router = express.Router(); // 创建 Express 路由实例

// @路由 POST /api/checkout
// @描述 创建新的结账会话（保存即将支付的订单信息）
// @权限 私有（需要用户登录）
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  // 如果未传入商品列表或为空，提示错误
  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "结账商品不能为空" });
  }

  try {
    // 创建新的结账记录，尚未支付
    const newCheckout = await Checkout.create({
      user: req.user._id, // 当前登录用户
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "处理中",
      isPaid: false,
    });

    console.log(`✅ 用户 ${req.user._id} 创建了结账会话`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("❌ 创建结账会话失败：", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 PUT /api/checkout/:id/pay
// @描述 支付成功后，更新结账状态为“已支付”
// @权限 私有
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    // 根据结账 ID 查找记录
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "结账记录未找到" });
    }

    // 如果支付成功，更新结账记录
    if (paymentStatus === "已支付") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "无效的支付状态" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 POST /api/checkout/:id/finalize
// @描述 支付成功后，将结账信息转化为正式订单（一次性操作）
// @权限 私有
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    // 查找对应结账会话
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "结账记录未找到" });
    }

    // 仅在结账状态已支付且尚未生成订单的前提下允许生成订单
    if (checkout.isPaid && !checkout.isFinalized) {
      console.log("🧾 生成订单内容：", checkout.checkoutItems);

      // 创建订单（复制结账信息）
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "已支付",
        paymentDetails: checkout.paymentDetails,
      });

      // 标记结账会话为已完成
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      // 删除该用户的购物车（下单成功后清空购物车）
      await Cart.findOneAndDelete({ user: checkout.user });

      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      // 如果已经完成结账，不允许重复生成订单
      res.status(400).json({ message: "该结账记录已完成" });
    } else {
      // 如果尚未支付，不允许生成订单
      res.status(400).json({ message: "尚未支付，无法生成订单" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 导出路由模块
module.exports = router;
