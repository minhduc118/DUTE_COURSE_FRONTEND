import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/PaymentPage.css";
import { createOrder, checkOrderStatus } from "../api/OrderAPI";
import { useAuth } from "../context/AuthContext";
import { OrderResponse } from "../model/OrderModel";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [status, setStatus] = useState<
    "PENDING" | "PAID" | "EXPIRED" | "CANCELLED"
  >("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasCreatedOrder = useRef(false);

  useEffect(() => {
    const initOrder = async () => {
      const state = location.state as any;
      if (state && state.courseId) {
        if (hasCreatedOrder.current) return;
        hasCreatedOrder.current = true;
        try {
          setLoading(true);
          // Gọi API tạo đơn hàng
          const newOrder = await createOrder({
            courseId: state.courseId,
            amount: state.price,
            discountCode: state.discountCode,
            userId: user?.userId || 1, // Hardcoded fallback
            paymentMethod: "SEPAY", // Hardcoded for now
          });
          console.log("Đơn hàng mới:", newOrder);
          setOrder(newOrder);
          // Convert expiredAt (string) to timestamp (number)
          const expiredAtTimestamp = new Date(newOrder.expiredAt).getTime();
          setTimeLeft(Math.floor((expiredAtTimestamp - Date.now()) / 1000));
        } catch (err) {
          console.error("Failed to create order:", err);
          setError("Không thể tạo đơn hàng. Vui lòng thử lại.");
          // Fallback to mock data for testing UI if API fails (Optional - remove in production)
          const mockOrder: OrderResponse = {
            orderId: "DH" + Date.now().toString().slice(-6),
            amount: state.price,
            description: `Thanh toan khoa hoc: ${state.courseTitle}`,
            bankAccount: "0363229782",
            bankName: "MBBank",
            accountName: "NGUYEN VAN A",
            expiredAt: Date.now() + 15 * 60 * 1000,
            status: "PENDING",
          };
          setOrder(mockOrder);
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback mock data nếu truy cập trực tiếp
        const mockOrder: OrderResponse = {
          orderId: "DH" + Math.floor(Math.random() * 10000),
          amount: 199000,
          description: "Thanh toan khoa hoc ReactJS",
          bankAccount: "0363229782",
          bankName: "MBBank",
          accountName: "NGUYEN VAN A",
          expiredAt: Date.now() + 15 * 60 * 1000,
          status: "PENDING",
        };
        setOrder(mockOrder);
        setLoading(false);
      }
    };

    initOrder();
  }, [location.state]);

  // Countdown Timer
  useEffect(() => {
    if (!order) return;

    const timer = setInterval(() => {
      const expiredAtTimestamp = new Date(order.expiredAt).getTime();
      const secondsRemaining = Math.floor(
        (expiredAtTimestamp - Date.now()) / 1000
      );
      if (secondsRemaining <= 0) {
        setTimeLeft(0);
        setStatus("EXPIRED");
        clearInterval(timer);
      } else {
        setTimeLeft(secondsRemaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [order]);

  // Polling kiểm tra trạng thái đơn hàng
  useEffect(() => {
    console.log("Polling effect triggered. Order:", order, "Status:", status);
    if (!order || status !== "PENDING") {
      console.log(
        "Polling skipped because order is null or status is not PENDING"
      );
      return;
    }

    console.log("Starting polling interval for order:", order.orderId);
    const interval = setInterval(async () => {
      try {
        console.log("Calling checkOrderStatus...");
        const result = await checkOrderStatus(order.orderId);
        console.log("Check status result:", result);
        if (result.status === "PAID") {
          setStatus("PAID");
          alert("Thanh toán thành công!");
          navigate("/my-courses");
        } else if (
          result.status === "EXPIRED" ||
          result.status === "CANCELLED"
        ) {
          setStatus(result.status as any);
        }
      } catch (err) {
        console.error("Error checking status:", err);
      }
    }, 2000); // Check mỗi 2 giây

    return () => clearInterval(interval);
  }, [status, order, navigate]);

  const formatTime = (seconds: number) => {
    if (seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading)
    return (
      <div className="payment-container">
        <div className="loading">Đang tạo đơn hàng...</div>
      </div>
    );
  if (error)
    return (
      <div className="payment-container">
        <div className="alert error">{error}</div>
      </div>
    );
  if (!order)
    return (
      <div className="payment-container">
        <div>Không có thông tin đơn hàng</div>
      </div>
    );

  // Tạo URL QR Code theo định dạng SePay
  const qrUrl = `https://qr.sepay.vn/img?acc=0986312587&bank=MBBANK&amount=${order.amount
    }&des=${encodeURIComponent(
      order.description
    )}&template=compact&download=true`;

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h2>Thanh toán đơn hàng</h2>
          <p className="order-id">
            Mã đơn: <strong>{order.orderId}</strong>
          </p>
        </div>

        <div className="payment-body">
          <div className="qr-section">
            <div className="qr-frame">
              <img src={qrUrl} alt="QR Code Thanh Toán" className="qr-image" />
            </div>
            <p className="scan-instruction">Mở App Ngân hàng để quét mã QR</p>
          </div>

          <div className="info-section">
            <div className="info-row">
              <span>Số tiền:</span>
              <span className="amount">
                {order.amount.toLocaleString("vi-VN")} đ
              </span>
            </div>
            <div className="info-row">
              <span>Nội dung:</span>
              <span className="copyable">{order.description}</span>
            </div>
            <div className="info-row">
              <span>Ngân hàng:</span>
              <span>{order.bankName}</span>
            </div>
            <div className="info-row">
              <span>Chủ tài khoản:</span>
              <span>Dang Do Minh Duc</span>
            </div>

            <div className="timer-box">
              <p>Đơn hàng hết hạn sau:</p>
              <div className="countdown">{formatTime(timeLeft)}</div>
            </div>

            {status === "EXPIRED" && (
              <div className="alert error">
                Đơn hàng đã hết hạn. Vui lòng tạo đơn mới.
              </div>
            )}
            {status === "PAID" && (
              <div className="alert success">
                Thanh toán thành công! Đang chuyển hướng...
              </div>
            )}
          </div>
        </div>

        <div className="payment-footer">
          <button className="btn-cancel" onClick={() => navigate("/")}>
            Hủy bỏ
          </button>
          <button
            className="btn-confirm"
            onClick={() => alert("Đang kiểm tra...")}
          >
            Tôi đã thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
