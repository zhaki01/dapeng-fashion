// cartRoutes 包含了购物车相关的所有路由，包括添加商品、更新商品数量、删除商品、获取购物车等
// 以及合并访客购物车和用户购物车的功能
// 该文件使用了 Express 框架和 Mongoose ODM 来处理 MongoDB 数据库的操作
// cartRoutes.js

const express = require("express");
const Cart = require("../models/Cart"); // 引入购物车模型
const Product = require("../models/Product"); // 引入商品模型（用于获取商品信息）
const { protect } = require("../middleware/authMiddleware"); // 引入身份认证中间件

const router = express.Router();

// 帮助函数：根据登录用户 ID 或访客 ID 获取购物车记录
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// @路由 POST /api/cart
// @描述 向购物车添加商品（支持访客或登录用户）
// @权限 公开
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    // 获取商品信息
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "商品不存在" });

    // 获取购物车（根据 userId 或 guestId）
    let cart = await getCart(userId, guestId);

    if (cart) {
      // 检查商品是否已存在于购物车中（同一商品、颜色、尺码）
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        // 如果已存在，增加商品数量
        cart.products[productIndex].quantity += quantity;
      } else {
        // 否则添加新商品项
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      // 重新计算购物车总价
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      // 如果没有购物车，新建一条记录
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 PUT /api/cart
// @描述 更新购物车中商品数量（访客或登录用户）
// @权限 公开
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "购物车未找到" });

    // 查找对应的商品项
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        // 更新数量
        cart.products[productIndex].quantity = quantity;
      } else {
        // 如果数量为 0，则移除该商品
        cart.products.splice(productIndex, 1);
      }

      // 更新总价
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "购物车中未找到该商品" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 DELETE /api/cart
// @描述 从购物车移除商品
// @权限 公开
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "购物车未找到" });

    // 查找商品
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      // 删除商品项
      cart.products.splice(productIndex, 1);

      // 重新计算总价
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "购物车中未找到该商品" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 GET /api/cart
// @描述 获取登录用户或访客的购物车
// @权限 公开
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "购物车未找到" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 POST /api/cart/merge
// @描述 登录后将访客购物车合并到用户购物车
// @权限 私有（需要身份验证）
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    // 查找访客和用户的购物车
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart) {
      // 如果访客购物车为空则提示
      if (guestCart.products.length === 0) {
        return res.status(400).json({ message: "访客购物车为空" });
      }

      if (userCart) {
        // 合并商品项
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (productIndex > -1) {
            // 如果已存在，增加数量
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            // 否则直接添加
            userCart.products.push(guestItem);
          }
        });

        // 重新计算总价
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();

        // 删除访客购物车
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.error("删除访客购物车失败：", error);
        }

        res.status(200).json(userCart);
      } else {
        // 如果用户还没有购物车，直接将访客购物车转为用户购物车
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();

        res.status(200).json(guestCart);
      }
    } else {
      // 如果找不到访客购物车，返回用户购物车或错误信息
      if (userCart) {
        return res.status(200).json(userCart);
      }
      res.status(404).json({ message: "访客购物车未找到" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 导出路由模块
module.exports = router;
// 该文件定义了购物车相关的所有路由，包括添加商品、更新商品数量、删除商品、获取购物车等
