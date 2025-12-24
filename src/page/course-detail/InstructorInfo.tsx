import React from "react";

export const InstructorInfo: React.FC = () => {
    return (
        <div className="instructor-section">
            <h3 className="content-section-title">Giảng viên</h3>
            <div className="instructor-profile">
                <div
                    className="instructor-avatar-placeholder"
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "#ccc",
                    }}
                ></div>
                <div>
                    <div className="instructor-name">DUC DAY</div>
                    <div className="instructor-title">Co-Founder & Fullstack Developer</div>
                </div>
            </div>
            <div className="instructor-stats">
                <div className="stat-item">
                    <i className="bi bi-star-fill"></i> 4.7 Xếp hạng
                </div>
                <div className="stat-item">
                    <i className="bi bi-people-fill"></i> 500,000+ Học viên
                </div>
                <div className="stat-item">
                    <i className="bi bi-play-circle-fill"></i> 12 Khóa học
                </div>
            </div>
            <p className="instructor-bio">
                I'm Angela, I am a developer with a passion for teaching. I'm the lead
                instructor at the London App Brewery, London's leading Programming
                Bootcamp.
            </p>
        </div>
    );
};
