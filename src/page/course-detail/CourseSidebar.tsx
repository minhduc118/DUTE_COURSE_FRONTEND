import React, { useMemo, useState } from "react";
import { CourseModel } from "../../model/CourseModel";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../api/OrderAPI";

interface CourseSidebarProps {
    course: CourseModel;
    slug?: string;
    isAuthenticated: boolean;
    user?: { userId: number } | null;
    addToast: (message: string, type: "success" | "warning" | "error") => void;
    setCourse: React.Dispatch<React.SetStateAction<CourseModel | null>>;
    setShowPaymentModal: (show: boolean) => void;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
    course,
    slug,
    isAuthenticated,
    user,
    addToast,
    setCourse,
    setShowPaymentModal,
}) => {
    const navigate = useNavigate();
    const [registering, setRegistering] = useState(false);

    const thumbnailSrc = useMemo(() => {
        if (!course?.thumbnailBase64) return null;
        return course.thumbnailBase64.startsWith("data:")
            ? course.thumbnailBase64
            : `data:image/png;base64,${course.thumbnailBase64}`;
    }, [course?.thumbnailBase64]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const getFormatDuration = () => {
        if (!course?.sections) return "0h 0p";
        const totalSeconds = course.sections.reduce(
            (acc: number, section: any) =>
                acc +
                (section.lessons?.reduce(
                    (sum: number, lesson: any) => sum + (lesson.durationSeconds || 0),
                    0
                ) || 0),
            0
        );
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours}h ${minutes}p`;
    };

    return (
        <div className="course-sidebar-wrapper">
            <div className="sidebar-sticky">
                {/* Video Preview */}
                <div
                    className="preview-card"
                    onClick={() => navigate(`/courses/${slug}/learn`)}
                >
                    <div className="preview-overlay">
                        <div className="play-button">
                            <i className="bi bi-play-fill"></i>
                        </div>
                        <span className="preview-text">Xem trước khóa học này</span>
                    </div>
                    {thumbnailSrc ? (
                        <img
                            src={thumbnailSrc}
                            className="preview-img"
                            alt="Course Preview"
                        />
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                background: "#333",
                            }}
                        ></div>
                    )}
                </div>

                {/* Price & Actions */}
                <div className="price-card">
                    <div className="price-row">
                        {course.discountPrice && course.discountPrice < course.price ? (
                            <>
                                <span className="current-price">
                                    {formatPrice(course.discountPrice)}
                                </span>
                                <span className="original-price">
                                    {formatPrice(course.price)}
                                </span>
                                <span className="discount-badge">
                                    GIẢM{" "}
                                    {Math.round(
                                        ((course.price - course.discountPrice) / course.price) * 100
                                    )}
                                    %
                                </span>
                            </>
                        ) : (
                            <span className="current-price">
                                {course.price === 0 ? "Miễn phí" : formatPrice(course.price)}
                            </span>
                        )}
                    </div>

                    <div className="action-buttons">
                        {!course.isOwner ? (
                            <>
                                <button
                                    className="btn-add-cart"
                                    onClick={async () => {
                                        if (!isAuthenticated)
                                            return navigate("/login", {
                                                state: { from: `/courses/${slug}` },
                                            });
                                        if (course.price === 0) {
                                            if (!user?.userId) return;
                                            try {
                                                setRegistering(true);
                                                const orderRes = await createOrder({
                                                    courseId: course.courseId,
                                                    amount: 0,
                                                    discountCode: "",
                                                    userId: user.userId,
                                                    paymentMethod: "FREE",
                                                });
                                                console.log(orderRes);
                                                if (orderRes.status === "PAID") {
                                                    addToast("Đăng ký thành công!", "success");
                                                    setCourse((prev: CourseModel | null) =>
                                                        prev ? { ...prev, isOwner: true } : prev
                                                    );
                                                    return;
                                                }
                                            } catch (err: any) {
                                                console.error(err);
                                                addToast("Đăng ký thất bại: " + err.message, "error");
                                            } finally {
                                                setRegistering(false);
                                            }
                                        } else setShowPaymentModal(true);
                                    }}
                                    disabled={registering}
                                >
                                    {registering
                                        ? "Đang xử lý..."
                                        : course.price === 0
                                            ? "Đăng ký miễn phí"
                                            : "Đăng ký ngay"}
                                </button>
                                {/* <button className="btn-buy-now">Thêm vào giỏ hàng</button> */}
                            </>
                        ) : (
                            <button
                                className="btn-add-cart"
                                onClick={() => navigate(`/courses/${slug}/learn`)}
                            >
                                Vào học ngay
                            </button>
                        )}
                    </div>

                    <p className="guarantee-text">Đảm bảo hoàn tiền trong 30 ngày</p>

                    <div className="includes-section">
                        <h4 className="includes-title">Khóa học bao gồm:</h4>
                        <div className="includes-list">
                            <div className="include-item">
                                <i className="bi bi-play-btn"></i>
                                <span>{getFormatDuration()} video theo yêu cầu</span>
                            </div>
                            <div className="include-item">
                                <i className="bi bi-journal-text"></i>
                                <span>{course.numberLessons} bài học</span>
                            </div>
                            <div className="include-item">
                                <i className="bi bi-file-text"></i>
                                <span>{course.readingLessonCount} bài đọc</span>
                            </div>
                            <div className="include-item">
                                <i className="bi bi-camera-video"></i>
                                <span>{course.videoLessonCount} video</span>
                            </div>
                            <div className="include-item">
                                <i className="bi bi-code-square"></i>
                                <span>{course.codingLessonCount} thực hành coding</span>
                            </div>
                            <div className="include-item">
                                <i className="bi bi-patch-question"></i>
                                <span>{course.quizLessonCount} bài kiểm tra</span>
                            </div>
                            <div className="include-item">
                                <i className="bi bi-person-video3"></i>
                                <span>Take care 1 -1 qua meet cùng mentor</span>
                            </div>
                            <div className="include-item">
                                <i className="bi bi-phone"></i>
                                <span>Truy cập trên thiết bị di động</span>
                            </div>
                            <div className="include-item">
                                <i className="bi bi-calendar-check"></i>
                                <span>Truy cập trong {course.durationInMonths} tháng</span>
                            </div>
                            <div className="include-item">
                                <i className="bi bi-trophy"></i>
                                <span>Chứng chỉ hoàn thành</span>
                            </div>
                        </div>
                    </div>

                    <div className="share-links">
                        <span>Chia sẻ</span>
                        <span>Tặng khóa học này</span>
                        <span>Nhập mã giảm giá</span>
                    </div>
                </div>

                {/* Business Ad */}
                <div className="price-card">
                    <h4 className="box-title" style={{ fontSize: 18 }}>
                        Đào tạo cho doanh nghiệp?
                    </h4>
                    <p style={{ fontSize: 14, color: "#475569", marginBottom: 16 }}>
                        Giúp đội ngũ của bạn truy cập hơn 25,000 khóa học hàng đầu bất kỳ
                        lúc nào.
                    </p>
                    <button
                        className="btn-buy-now"
                        style={{ fontSize: 14, fontWeight: 700 }}
                    >
                        Dùng thử Business Plan
                    </button>
                </div>
            </div>
        </div>
    );
};
