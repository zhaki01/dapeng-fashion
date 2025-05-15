// File: backend/models/Product.js
// Product.js
// 商品模型
// 该模型用于存储商品的详细信息

const mongoose = require("mongoose");

// 定义商品的数据结构（Schema）
const productSchema = new mongoose.Schema(
  {
    // 商品名称（必填，去除首尾空格）
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // 商品描述（必填）
    description: {
      type: String,
      required: true,
    },

    // 商品原价（必填）
    price: {
      type: Number,
      required: true,
    },

    // 折扣价（可选）
    discountPrice: {
      type: Number,
    },

    // 商品库存数量（必填，默认 0）
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },

    // 商品唯一编码 SKU（必填，不能重复）
    sku: {
      type: String,
      unique: true,
      required: true,
    },

    // 所属分类（如“上衣”、“鞋子”等）（必填）
    category: {
      type: String,
      required: true,
    },

    // 品牌（如 Nike、Adidas 等）（可选）
    brand: {
      type: String,
    },

    // 支持的尺寸列表（如 ["S", "M", "L"]）（必填）
    sizes: {
      type: [String],
      required: true,
    },

    // 支持的颜色列表（如 ["黑色", "白色"]）（必填）
    colors: {
      type: [String],
      required: true,
    },

    // 商品所属系列（如“春季系列”、“限量款”）（必填）
    collections: {
      type: String,
      required: true,
    },

    // 材质信息（如“纯棉”、“涤纶”等）（可选）
    material: {
      type: String,
    },

    // 面向性别（可选，只能是以下三种之一）
    gender: {
      type: String,
      enum: ["男士", "女士", "男女通用"],
    },

    // 商品图片数组，每张图片包含 URL 和可选的 alt 文本（用于无障碍）
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: {
          type: String,
        },
      },
    ],

    // 是否为推荐商品（默认为 false）
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // 是否已发布（默认为 false，未发布不会在前台显示）
    isPublished: {
      type: Boolean,
      default: false,
    },

    // 平均评分（默认 0，基于用户评价计算）
    rating: {
      type: Number,
      default: 0,
    },

    // 评论数量（默认 0）
    numReviews: {
      type: Number,
      default: 0,
    },

    // 商品标签（如 ["夏季", "新款"]，用于搜索优化）
    tags: [String],

    // 发布该商品的用户 ID（关联 User 表，表示是谁发布的）
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // SEO：页面标题
    metaTitle: {
      type: String,
    },

    // SEO：页面描述
    metaDescription: {
      type: String,
    },

    // SEO：页面关键词
    metaKeywords: {
      type: String,
    },

    // 商品尺寸信息（用于物流、展示）
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    // 商品重量（用于物流）
    weight: Number,
  },
  {
    // 自动添加 createdAt（创建时间）和 updatedAt（更新时间）
    timestamps: true,
  }
);

// 创建并导出商品模型，供控制器等模块调用使用
module.exports = mongoose.model("Product", productSchema);
