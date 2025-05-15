// productRoutes.js
// 📁 商品前台接口路由
// 说明：本文件包含用户或管理员对商品的所有操作接口，如：新增、修改、删除、查询、筛选、获取热销或相似商品等

const express = require("express");
const Product = require("../models/Product"); // 商品数据模型
const { protect, admin } = require("../middleware/authMiddleware"); // 登录和管理员权限中间件

const router = express.Router(); // 创建路由对象

// 🟡 创建新商品（管理员）
// POST /api/products
router.post("/", protect, admin, async (req, res) => {
  try {
    // 从请求体中解构所有商品字段
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    // 创建新商品对象，附带当前管理员ID
    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id, // 当前操作人（管理员）
    });

    // 保存商品并返回
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("服务器错误");
  }
});

// 🟡 修改商品（管理员）
// PUT /api/products/:id
router.put("/:id", protect, admin, async (req, res) => {
  try {
    // 获取前端传来的商品字段
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = await Product.findById(req.params.id); // 查找商品

    if (product) {
      // 将新值赋给对应字段（如果没有传值则保留原值）
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      // 保存更新后的商品
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "未找到商品" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("服务器错误");
  }
});

// 🟡 删除商品（管理员）
// DELETE /api/products/:id
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne(); // 删除商品
      res.json({ message: "商品已删除" });
    } else {
      res.status(404).json({ message: "未找到商品" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("服务器错误");
  }
});

// 🟡 获取所有商品（支持筛选、搜索、排序）
// GET /api/products
router.get("/", async (req, res) => {
  try {
    // 从查询参数中获取筛选条件
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {}; // MongoDB 查询条件对象

    // 筛选：系列
    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }

    // 筛选：分类
    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }

    // 筛选：材质（多个用逗号分隔）
    if (material) {
      query.material = { $in: material.split(",") };
    }

    // 筛选：品牌
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    // 筛选：尺码
    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    // 筛选：颜色
    if (color) {
      query.colors = { $in: [color] };
    }

    // 筛选：性别
    if (gender) {
      query.gender = gender;
    }

    // 筛选：价格范围
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice); // 大于等于
      if (maxPrice) query.price.$lte = Number(maxPrice); // 小于等于
    }

    // 搜索：商品名或描述中包含关键词（不区分大小写）
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 排序方式
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    // 查询商品，应用筛选、排序、限制数量
    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0); // 如果没有限制参数，返回全部

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("服务器错误");
  }
});

// 🟡 获取评分最高的商品
// GET /api/products/best-seller
router.get("/best-seller", async (req, res) => {
  try {
    // 查询评分最高的一个商品
    const bestSeller = await Product.findOne().sort({ rating: -1 });

    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "暂无热销商品" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("服务器错误");
  }
});

// 🟡 获取最新上架的商品（取前8个）
// GET /api/products/new-arrivals
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 }) // 按创建时间倒序
      .limit(8); // 只返回8个
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).send("服务器错误");
  }
});

// 🟡 获取单个商品信息（根据商品ID）
// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // 查找商品
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "未找到商品" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("服务器错误");
  }
});

// 🟡 获取相似商品（同分类 + 同性别，不包括自身）
// GET /api/products/similar/:id
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "未找到商品" });
    }

    // 查找相同分类和性别的商品，排除自己，最多返回4个
    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("服务器错误");
  }
});

// 导出该路由模块供主程序使用
module.exports = router;
