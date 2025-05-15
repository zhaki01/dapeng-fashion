// File: backend/routes/favoriteRoutes.js
// 收藏 & 推荐相关接口说明：
// 此文件定义了“收藏夹”操作及基于用户收藏、浏览、购买行为的推荐逻辑。
// 包含：添加收藏、取消收藏、获取收藏列表以及智能推荐商品功能。

const express = require("express");
const router = express.Router(); // 创建一个路由实例
const { protect } = require("../middleware/authMiddleware"); // 中间件：验证用户 JWT，确保用户已登录
const Favorite = require("../models/Favorite"); // 收藏数据模型
const Product = require("../models/Product"); // 商品数据模型

// 常量：所有可选系列，用于回退默认推荐使用
const ALL_SERIES = [
  "商务休闲",
  "正式穿搭",
  "休闲穿搭",
  "度假穿搭",
  "商务穿搭",
  "街头风",
  "冬季必备",
  "基础款",
  "休闲系列",
  "都市系列",
  "智能休闲系列",
  "运动系列",
  "职场穿搭",
  "街头风格系列",
  "居家系列",
  "正式系列",
  "春季系列",
  "夏季系列",
  "针织系列",
  "内衣灵感系列",
  "基础系列",
  "晚装系列",
  "秋季系列",
  "职场系列",
];

// ——————————
// 路由 1：添加收藏
// POST /api/favorites
// 说明：当前用户点击“收藏”按钮时调用，需传入商品 ID。
// 返回：新建的收藏记录，或错误提示。
router.post("/", protect, async (req, res) => {
  const { productId } = req.body; // 从请求体中读取商品 ID
  if (!productId)
    // 参数校验：ID 必须提供
    return res.status(400).json({ message: "缺少商品ID" });
  try {
    // 检查该用户是否已收藏过此商品
    const exists = await Favorite.findOne({
      user: req.user._id,
      product: productId,
    });
    if (exists)
      // 如果已存在，拒绝重复收藏
      return res.status(400).json({ message: "该商品已收藏" });
    // 未收藏，则创建并保存新纪录
    const saved = await new Favorite({
      user: req.user._id,
      product: productId,
    }).save();
    res.status(201).json(saved); // 返回保存后的记录
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "服务器错误" });
  }
});

// ——————————
// 路由 2：取消收藏
// DELETE /api/favorites/:id
// 说明：根据收藏记录 ID 删除对应收藏，需要登录。
router.delete("/:id", protect, async (req, res) => {
  try {
    const fav = await Favorite.findById(req.params.id); // 查询要删除的收藏记录
    if (!fav)
      // 不存在则返回 404
      return res.status(404).json({ message: "收藏记录不存在" });
    // 只有记录所属用户才有删除权
    if (fav.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "无权限删除" });
    await fav.deleteOne(); // 执行删除
    res.json({ message: "收藏已取消" }); // 返回成功信息
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "服务器错误" });
  }
});

// ——————————
// 路由 3：获取收藏列表
// GET /api/favorites
// 说明：获取当前（或指定）用户的所有收藏商品。
router.get("/", protect, async (req, res) => {
  try {
    const uid = req.query.userId || req.user._id; // 支持管理员查询他人收藏
    if (req.query.userId && req.user.role !== "管理员")
      return res.status(403).json({ message: "无权限查询" });
    const list = await Favorite.find({ user: uid }) // 查找收藏
      .populate({
        path: "product",
        select: "name price images collections", // 仅取展示所需字段
      });
    // 过滤掉关联商品为空（已被删除）的记录
    res.json(list.filter((f) => f.product));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "服务器错误" });
  }
});

// ——————————
// 路由 4：获取推荐商品
// GET /api/favorites/recommendations
// 说明：基于用户的收藏(3分)、浏览(1分)、购买(2分)行为，智能推荐多样化商品。
router.get("/recommendations", protect, async (req, res) => {
  try {
    // 1. 收藏行为
    const favs = await Favorite.find({ user: req.user._id }).populate({
      path: "product",
      select: "collections",
    });
    // 2. 浏览历史
    const BrowsingHistory = require("../models/BrowsingHistory");
    const browses = await BrowsingHistory.find({
      userId: req.user._id,
    }).populate({
      path: "productId",
      select: "collections",
    });
    // 3. 订单记录
    const Order = require("../models/Order");
    const orders = await Order.find({ user: req.user._id }).populate({
      path: "orderItems.productId",
      select: "collections",
    });

    // 4. 计算每个系列的总分
    const styleCount = {};
    favs.forEach((f) => {
      const c = f.product?.collections;
      if (c) styleCount[c] = (styleCount[c] || 0) + 3;
    });
    browses.forEach((h) => {
      const c = h.productId?.collections;
      if (c) styleCount[c] = (styleCount[c] || 0) + 1;
    });
    orders.forEach((o) =>
      o.orderItems.forEach((i) => {
        const c = i.productId?.collections;
        if (c) styleCount[c] = (styleCount[c] || 0) + 2;
      })
    );

    // 5. 取分最高的前三个系列
    const preferred = Object.entries(styleCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([style]) => style);

    // 判断用户是否有过任何行为
    const hasAction = favs.length || browses.length || orders.length;

    // 6. 确定推荐目标系列：
    //   - 有真实偏好时，优先使用 preferred
    //   - 无偏好但有行为时，回退到 ALL_SERIES
    //   - 新用户无行为时，空列表
    const targetStyles = preferred.length
      ? preferred
      : hasAction
      ? ALL_SERIES
      : [];

    // 7. 收集已见商品 ID，真实偏好用户排除这些
    const seen = new Set([
      ...favs.map((f) => f.product._id.toString()),
      ...browses.map((h) => h.productId._id.toString()),
      ...orders.flatMap((o) =>
        o.orderItems.map((i) => i.productId._id.toString())
      ),
    ]);

    // 8. 分批采样推荐
    const RECOMMEND_COUNT = 8;
    let recs = [];

    if (preferred.length) {
      // a. 真正偏好：排除已见，按 preferred 分风格采样
      const per = Math.ceil(RECOMMEND_COUNT / preferred.length);
      for (const style of targetStyles) {
        if (recs.length >= RECOMMEND_COUNT) break;
        const list = await Product.find({
          collections: style,
          _id: { $nin: Array.from(seen) },
        })
          .limit(per)
          .lean();
        recs.push(...list);
      }
      // b. 若数量不足，补充未排除已见的相同偏好
      if (recs.length < RECOMMEND_COUNT) {
        const remain = RECOMMEND_COUNT - recs.length;
        const fill = await Product.find({ collections: { $in: preferred } })
          .limit(remain)
          .lean();
        recs.push(...fill);
      }
    } else if (hasAction) {
      // 仅有行为但无偏好：直接从所有 targetStyles 采样
      const per = Math.ceil(RECOMMEND_COUNT / targetStyles.length);
      for (const style of targetStyles) {
        if (recs.length >= RECOMMEND_COUNT) break;
        const list = await Product.find({ collections: style })
          .limit(per)
          .lean();
        recs.push(...list);
      }
    }

    const finalRecs = recs.slice(0, RECOMMEND_COUNT); // 截取前 N
    res.json(finalRecs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "推荐生成失败", error: err.message });
  }
});

module.exports = router;
