// PayPalButton.jsx
// 💳 PayPal 支付按钮组件
// 本组件用于集成 PayPal 支付功能，使用官方提供的 React SDK：@paypal/react-paypal-js。
// 使用 createOrder 创建订单，onApprove 捕获支付成功，onError 捕获错误回调。
// 父组件传入金额（amount）和两个回调函数（onSuccess 和 onError）。

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

// PayPalButton 组件接收 3 个 props：
// amount: 支付金额（数字）
// onSuccess: 支付成功后的回调函数
// onError: 支付失败时的回调函数
const PayPalButton = ({ amount, onSuccess, onError }) => {
  return (
    // ✅ PayPalScriptProvider 是 PayPal 的外层提供器，必须包裹 PayPalButtons
    <PayPalScriptProvider
      options={{
        // 使用从环境变量中读取的 PayPal 客户端 ID（在 .env 中设置）
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
      }}
    >
      {/* ✅ PayPal 按钮渲染区域 */}
      <PayPalButtons
        style={{ layout: "vertical" }} // 按钮布局为垂直方向
        // ✅ 创建订单逻辑
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                // 将金额格式化为小数点后两位（例如 123.00）
                amount: { value: parseFloat(amount).toFixed(2) },
              },
            ],
          });
        }}
        // ✅ 支付成功时触发的回调，PayPal 会自动调用 order.capture() 并返回结果
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess); // 调用父组件的 onSuccess 回调
        }}
        // ✅ 支付错误时触发的回调
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

// ✅ 导出组件
export default PayPalButton;
