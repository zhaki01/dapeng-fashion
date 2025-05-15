// File: Checout.js
// Checkout.js
// 结账模型
// 该模型用于存储用户的结账信息（即用户提交订单时的所有内容）

// 引入 mongoose，用于定义 MongoDB 数据模型
const mongoose = require("mongoose");

// 定义每个结账商品项的结构（即用户订单中的每一个商品）
const checkoutItemSchema = new mongoose.Schema(
  {
    // 商品 ID，关联 Product 表
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true, // 必填
    },
    // 商品名称
    name: {
      type: String,
      required: true,
    },
    // 商品图片
    image: {
      type: String,
      required: true,
    },
    // 商品单价
    price: {
      type: Number,
      required: true,
    },
    // 购买数量
    quantity: {
      type: Number,
      required: true,
    },
    // 商品尺寸（可选）
    size: String,
    // 商品颜色（可选）
    color: String,
  },
  {
    _id: false, // 不单独为每个商品项生成 _id 字段（简化结构）
  }
);

// 定义整个结账订单的结构（主文档）
const checkoutSchema = new mongoose.Schema(
  {
    // 订单所属用户的 ID，关联 User 表
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // 所有结账商品项的列表
    checkoutItems: [checkoutItemSchema],

    // 配送地址（含详细地址、城市、邮编、国家）
    shippingAddress: {
      address: { type: String, required: true }, // 详细地址
      city: { type: String, required: true }, // 城市
      postalCode: { type: String, required: true }, // 邮编
      country: { type: String, required: true }, // 国家
    },

    // 支付方式，例如 "支付宝"、"微信"、"PayPal"
    paymentMethod: {
      type: String,
      required: true,
    },

    // 当前订单的总价（所有商品 × 数量）
    totalPrice: {
      type: Number,
      required: true,
    },

    // 是否已支付（默认为 false）
    isPaid: {
      type: Boolean,
      default: false,
    },

    // 支付时间（如果已支付）
    paidAt: {
      type: Date,
    },

    // 支付状态，用于前端展示，如“处理中”、“成功”等
    paymentStatus: {
      type: String,
      default: "处理中",
      // default: "pending",
    },

    // 支付详情（可用于存储支付响应、交易号等，格式不固定）
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed, // 接收任意格式的支付信息
    },

    // 是否已完成订单（如发货或确认收货后）
    isFinalized: {
      type: Boolean,
      default: false,
    },

    // 完成订单的时间
    finalizedAt: {
      type: Date,
    },
  },
  {
    // 自动添加 createdAt 和 updatedAt 字段，记录订单创建与更新时间
    timestamps: true,
  }
);

// 导出 Checkout 模型，供控制器或其他模块使用
module.exports = mongoose.model("Checkout", checkoutSchema);
