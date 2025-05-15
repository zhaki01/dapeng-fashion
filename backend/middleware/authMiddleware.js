// authMiddleware.js
// 认证中间件
// 该中间件用于验证用户的身份和权限
// 通过 JWT 令牌验证用户身份
// 以及检查用户是否具有管理员权限

// 引入所需模块
const jwt = require("jsonwebtoken"); // 用于处理 JSON Web Token（JWT）
const User = require("../models/User"); // 引入用户模型，用于查询数据库中的用户信息

// 路由保护中间件（验证用户登录）
// 如果用户提供了有效的 JWT 令牌，则允许其访问后续接口
const protect = async (req, res, next) => {
  let token; // 用于存储解析出的令牌内容

  // 判断请求头中是否存在 Authorization 字段，且以 Bearer 开头
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 从请求头中提取出令牌（去掉 "Bearer " 前缀）
      token = req.headers.authorization.split(" ")[1];

      // 验证令牌合法性，并解码得到原始用户信息（如用户 ID）
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 根据令牌中的用户 ID 查询数据库，并附加到请求对象 req.user 上
      // select("-password") 表示排除用户密码字段，避免泄露敏感信息
      req.user = await User.findById(decoded.user.id).select("-password");

      next(); // 验证成功，继续执行后续中间件或接口处理逻辑
    } catch (error) {
      // 如果令牌无效或过期，返回 401 未授权状态码
      console.error("令牌验证失败:", error);
      res.status(401).json({ message: "未授权，令牌无效" });
    }
  } else {
    // 如果请求中没有提供令牌，也返回未授权提示
    res.status(401).json({ message: "未授权，未提供令牌" });
  }
};

// 管理员权限检查中间件
// 用于保护只能由管理员操作的接口（如商品管理、订单管理等）
const admin = (req, res, next) => {
  // 判断当前登录用户是否存在且角色是“管理员”
  if (req.user && req.user.role === "管理员") {
    next(); // 是管理员，继续执行接口逻辑
  } else {
    // 非管理员用户尝试访问管理员接口，返回 403 无权限错误
    res.status(403).json({ message: "无权限，仅限管理员访问" });
  }
};

// 导出中间件函数，供其他文件引入使用
module.exports = { protect, admin };
