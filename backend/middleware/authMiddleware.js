// authMiddleware.js
// 认证中间件
// 该中间件用于验证用户的身份和权限
// 通过 JWT 令牌验证用户身份
// 以及检查用户是否具有管理员权限
// 引入所需模块
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 路由保护中间件（验证用户登录）
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 查找用户信息，并排除密码字段
      req.user = await User.findById(decoded.user.id).select("-password");
      next(); // 继续执行后续中间件或路由处理器
    } catch (error) {
      console.error("令牌验证失败:", error);
      res.status(401).json({ message: "未授权，令牌无效" });
    }
  } else {
    res.status(401).json({ message: "未授权，未提供令牌" });
  }
};

// 管理员权限检查中间件
const admin = (req, res, next) => {
  if (req.user && req.user.role === "管理员") {
    next(); // 是管理员，继续执行
  } else {
    res.status(403).json({ message: "无权限，仅限管理员访问" });
  }
};

module.exports = { protect, admin };
