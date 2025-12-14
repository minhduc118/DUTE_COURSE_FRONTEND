import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { CourseModel } from "../../model/CourseModel";
import { validateDiscountCode, DiscountValidationResult } from "../../api/DiscountAPI";
import "../../style/PaymentModal.css";

interface PaymentModalProps {
  course: CourseModel;
  isOpen: boolean;
  onClose: () => void;
  onPayment: (discountCode?: string, finalPrice?: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  course,
  isOpen,
  onClose,
  onPayment,
}) => {
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountValidationResult | null>(null);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [discountSuccess, setDiscountSuccess] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const originalPrice = course.price;
  const discountPrice =
    course.discountPrice && course.discountPrice < course.price
      ? course.discountPrice
      : course.price;

  const finalPrice = useMemo(() => {
    if (appliedDiscount) {
      return appliedDiscount.newPrice;
    }
    return discountPrice;
  }, [discountPrice, appliedDiscount]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsCheckingCode(true);
    setDiscountError(null);
    setDiscountSuccess(null);
    setAppliedDiscount(null);

    try {
      const result = await validateDiscountCode(discountCode, course.courseId, discountPrice);

      if (result.valid) {
        setAppliedDiscount(result);
        setDiscountSuccess(result.message);
      } else {
        setDiscountError(result.message);
      }
    } catch (error) {
      setDiscountError("Có lỗi xảy ra khi kiểm tra mã giảm giá.");
    } finally {
      setIsCheckingCode(false);
    }
  };

  const handlePayment = () => {
    onPayment(discountCode || undefined, finalPrice);
  };

  const thumbnailSrc = useMemo(() => {
    if (!course.thumbnailBase64) return null;
    return course.thumbnailBase64.startsWith("data:")
      ? course.thumbnailBase64
      : `data:image/png;base64,${course.thumbnailBase64}`;
  }, [course.thumbnailBase64]);

  if (!isOpen) return null;

  if (typeof document === "undefined") return null;

  const modalContent = (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div
        className="payment-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="payment-modal-close" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>

        <div className="payment-modal-content">
          {/* Left Section - Course Information */}
          <div className="payment-modal-left">
            <div className="course-info-header">
              <div className="course-logo-circle">
                {thumbnailSrc ? (
                  <img src={thumbnailSrc} alt={course.title} />
                ) : (
                  <span>{course.title.substring(0, 2)}</span>
                )}
              </div>
              <h2 className="course-info-title">{course.title}</h2>
            </div>

            <div className="course-benefits">
              <h3 className="benefits-title">Bạn nhận được gì từ khóa học này?</h3>
              {course.benefits ? (
                <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
                  {course.benefits.split("\n").map((benefit, index) => (
                    <li key={index} className="mb-2">
                      {benefit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{course.description}</p>
              )}
            </div>
          </div>

          {/* Right Section - Payment Details */}
          <div className="payment-modal-right">
            <div className="payment-details">
              <h3 className="payment-details-title">Chi tiết thanh toán</h3>

              <div className="payment-course-name">
                <span>{course.title}</span>
              </div>

              <div className="payment-pricing">
                <div className="price-row">
                  <span className="price-label">Giá gốc:</span>
                  <span className="price-original-modal">
                    {formatPrice(originalPrice)}
                  </span>
                </div>
                {discountPrice < originalPrice && (
                  <div className="price-row">
                    <span className="price-label">Giá ưu đãi hôm nay:</span>
                    <span className="price-discount-modal">
                      {formatPrice(discountPrice)}
                    </span>
                  </div>
                )}
              </div>

              <div className="discount-code-section">
                <div className="discount-input-group">
                  <input
                    type="text"
                    className={`discount-input ${discountError ? 'is-invalid' : ''} ${discountSuccess ? 'is-valid' : ''}`}
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value);
                      setDiscountError(null);
                      setDiscountSuccess(null);
                    }}
                    disabled={isCheckingCode || !!appliedDiscount}
                  />
                  {appliedDiscount ? (
                    <button
                      className="btn-apply-discount btn-remove-discount"
                      onClick={() => {
                        setAppliedDiscount(null);
                        setDiscountCode("");
                        setDiscountSuccess(null);
                      }}
                    >
                      Xóa
                    </button>
                  ) : (
                    <button
                      className="btn-apply-discount"
                      onClick={handleApplyDiscount}
                      disabled={isCheckingCode || !discountCode.trim()}
                    >
                      {isCheckingCode ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        "Áp dụng"
                      )}
                    </button>
                  )}
                </div>
                {discountError && <div className="discount-message error">{discountError}</div>}
                {discountSuccess && <div className="discount-message success">{discountSuccess}</div>}
              </div>

              <div className="payment-total">
                <div className="total-row">
                  <span className="total-label">TỔNG</span>
                  <span className="total-amount">
                    {formatPrice(finalPrice)}
                  </span>
                </div>
              </div>

              <button className="btn-payment-continue" onClick={handlePayment}>
                Tiếp tục thanh toán
              </button>

              <div className="payment-security">
                <i className="bi bi-lock-fill"></i>
                <span>Thanh toán an toàn với SePay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

