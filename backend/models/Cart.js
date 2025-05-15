// Cart.js
// 购物车模型
// 该模型用于存储用户的购物车信息

// 引入 mongoose，用于创建和操作 MongoDB 数据模型
const mongoose = require("mongoose");

// 定义购物车中单个商品的结构（子文档）
const cartItemSchema = new mongoose.Schema(
  {
    // 商品 ID，引用 Product 表中的商品信息
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true, // 必填项
    },
    // 商品名称
    name: String,
    // 商品图片地址
    image: String,
    // 商品价格（注意：此处为字符串，若参与计算建议使用 Number 类型）
    price: String,
    // 商品尺寸（例如 S、M、L）
    size: String,
    // 商品颜色
    color: String,
    // 商品数量，默认是 1
    quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    // _id: false 表示每个商品项不单独生成 _id 字段（用于简化数据结构）
    _id: false,
  }
);

// 定义整个购物车的结构（主文档）
const cartSchema = new mongoose.Schema(
  {
    // 登录用户的 ID（如果是注册用户）
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // 游客身份 ID（用于未登录用户购物车）
    guestId: {
      type: String,
    },
    // 购物车中的商品列表，使用上面定义的 cartItemSchema
    products: [cartItemSchema],
    // 购物车中商品的总价
    totalPrice: {
      type: Number,
      required: true, // 必填项
      default: 0, // 默认值为 0
    },
  },
  {
    // 自动生成 createdAt 和 updatedAt 字段，用于记录创建和更新时间
    timestamps: true,
  }
);

// 导出 Cart 模型，供控制器等其他模块操作使用
module.exports = mongoose.model("Cart", cartSchema);
