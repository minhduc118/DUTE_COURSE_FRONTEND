import React from "react";

export const InstructorWidget: React.FC = () => {
    return (
        <div className="side-widget">
            <h4 className="widget-title">Giảng viên</h4>
            <div className="instructor-brief">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40, fontWeight: 'bold' }}>MĐ</div>
                <div className="instructor-info-small">
                    <p className="instructor-name-small">Minh Đức</p>
                    <p className="instructor-role-small">Full Stack Developer</p>
                </div>
            </div>
            <p className="instructor-bio-brief">Kinh nghiệm 5+ năm trong lĩnh vực phát triển web và giảng dạy.</p>
            <button className="btn-widget-action">Xem hồ sơ</button>
        </div>
    );
};
