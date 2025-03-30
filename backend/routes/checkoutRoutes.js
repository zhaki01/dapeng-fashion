// checkoutRoutes包含了结账会话的所有路由，包括创建结账会话、支付结账会话、生成订单等功能
// 该文件使用了Express框架和Mongoose库来处理HTTP请求和与MongoDB数据库的交互
const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @路由 POST /api/checkout
// @描述 创建新的结账会话
// @权限 私有
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "结账商品不能为空" });
  }

  try {
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
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
// @描述 支付成功后更新结账状态为已支付
// @权限 私有
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "结账记录未找到" });
    }

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
// @描述 支付成功后将结账信息转换为正式订单
// @权限 私有
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "结账记录未找到" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      console.log("🧾 生成订单内容：", checkout.checkoutItems);

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

      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      // 删除用户购物车
      await Cart.findOneAndDelete({ user: checkout.user });

      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "该结账记录已完成" });
    } else {
      res.status(400).json({ message: "尚未支付，无法生成订单" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

module.exports = router;
