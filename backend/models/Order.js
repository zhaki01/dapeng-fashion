// File: backend/models/Order.js
// Order.js
// 订单模型
// 该模型用于存储用户的订单信息（如商品列表、收货地址、支付状态等）

// 引入 mongoose 模块，用于定义 MongoDB 数据结构
const mongoose = require("mongoose");

// 定义订单中单个商品项的数据结构（子文档）
const orderItemSchema = new mongoose.Schema(
  {
    // 商品 ID，关联 Product 表
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
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
    // 商品尺寸（如 S/M/L）
    size: String,
    // 商品颜色
    color: String,
    // 购买数量
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    // 不为每个商品项单独生成 _id 字段，简化结构
    _id: false,
  }
);

// 定义完整订单的数据结构（主文档）
const orderSchema = new mongoose.Schema(
  {
    // 下单用户 ID，关联 User 表
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 所有订单商品项的数组（使用上方定义的 orderItemSchema）
    orderItems: [orderItemSchema],

    // 配送地址（含地址、城市、邮编、国家）
    shippingAddress: {
      address: { type: String, required: true }, // 详细地址
      city: { type: String, required: true }, // 城市
      postalCode: { type: String, required: true }, // 邮政编码
      country: { type: String, required: true }, // 国家
    },

    // 支付方式，例如支付宝、微信、PayPal 等
    paymentMethod: {
      type: String,
      required: true,
    },

    // 当前订单的总金额（所有商品总价）
    totalPrice: {
      type: Number,
      required: true,
    },

    // 是否已支付（默认未支付）
    isPaid: {
      type: Boolean,
      default: false,
    },

    // 支付完成的时间（如果已付款）
    paidAt: {
      type: Date,
    },

    // 是否已发货（默认未发货）
    isDelivered: {
      type: Boolean,
      default: false,
    },

    // 发货完成的时间
    deliveredAt: {
      type: Date,
    },

    // 支付状态（默认值为“处理中”）
    paymentStatus: {
      type: String,
      default: "处理中",
      // default: "pending",
    },

    // 订单状态，用于跟踪处理流程（如处理中、已发货、已送达、已取消）
    status: {
      type: String,
      enum: ["处理中", "已发货", "已送达", "已取消"], // 限定只能使用这几种状态
      default: "处理中",
    },
  },
  {
    // 自动记录 createdAt（创建时间）与 updatedAt（更新时间）
    timestamps: true,
  }
);

// 创建并导出订单模型，供控制器或服务调用
module.exports = mongoose.model("order", orderSchema);
