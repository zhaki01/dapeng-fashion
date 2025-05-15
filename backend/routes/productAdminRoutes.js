// productAdminRoutes.js
// 📁 商品管理接口（后台专用）
// 本文件用于实现管理员对商品的管理功能：包括查看全部商品、添加新商品等

const express = require("express");
const Product = require("../models/Product"); // 商品数据模型
const { protect, admin } = require("../middleware/authMiddleware");
// 中间件：protect 保护接口（要求登录），admin 限制权限为管理员

const router = express.Router(); // 创建路由对象

// 🟡 路由1：获取所有商品列表
// 方法：GET
// 地址：/api/admin/products
// 描述：管理员查看系统内的所有商品（用于后台管理界面）
// 权限：仅限已登录的管理员访问
router.get("/", protect, admin, async (req, res) => {
  try {
    // 查询数据库中的所有商品记录
    const products = await Product.find({});

    // 返回查询结果
    res.json(products);
  } catch (error) {
    // 如果出错，返回 500 状态码和错误信息
    console.error(error);
    res.status(500).json({ message: "服务器错误，无法获取商品列表" });
  }
});

// 🟡 路由2：添加新商品
// 方法：POST
// 地址：/api/admin/products
// 描述：管理员添加一条新的商品数据
// 权限：仅限已登录的管理员访问
router.post("/", protect, admin, async (req, res) => {
  try {
    // 创建一个新的商品对象，使用前端传来的数据，并绑定当前管理员ID作为发布者
    const newProduct = new Product({
      ...req.body, // 拿到所有前端传入的商品字段（如 name、price 等）
      user: req.user._id, // 设置该商品的发布者为当前管理员
    });

    // 保存新商品到数据库
    const createdProduct = await newProduct.save();

    // 返回创建成功的商品数据，并设置 HTTP 状态码为 201（已创建）
    res.status(201).json(createdProduct);
  } catch (err) {
    // 如果出现错误，记录错误并返回失败信息
    console.error(err);
    res.status(500).json({ message: "添加商品失败" });
  }
});

// 导出该路由模块，供主程序引入使用
module.exports = router;
