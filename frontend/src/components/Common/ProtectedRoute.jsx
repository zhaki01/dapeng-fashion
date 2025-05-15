// ProtectedRoute.jsx
// ✅ 受保护的路由组件（页面访问权限控制）
// 本组件用于控制页面访问权限：
// - 若用户未登录，将被重定向到登录页
// - 若指定了角色（role），则只有该角色的用户才可访问该页面
// 常用于“个人中心”、“管理员后台”等页面的权限控制

import { useSelector } from "react-redux"; // 从 Redux 中获取用户登录信息
import { Navigate } from "react-router-dom"; // 用于页面跳转（重定向）

// 接收两个参数：
// children：被保护的页面内容（JSX）
// role：可选的用户角色限制（例如："管理员"）
const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth); // 获取当前登录用户

  // 🚫 情况一：用户未登录
  // 🚫 情况二：需要特定角色，但用户角色不匹配
  if (!user || (role && user.role !== role)) {
    // 重定向到登录页面，并使用 replace 替换历史记录
    return <Navigate to="/login" replace />;
  }

  // ✅ 情况三：用户已登录，且角色匹配（或不需要匹配角色）
  return children; // 渲染被保护的子组件（即目标页面内容）
};

// ✅ 导出 ProtectedRoute 组件
export default ProtectedRoute;
