import React, { useMemo } from "react";
import { CourseModel } from "../../model/CourseModel";

interface CourseBenefitsProps {
    course: CourseModel;
}

export const CourseBenefits: React.FC<CourseBenefitsProps> = ({ course }) => {
    // Helper to parse benefits
    const benefitsList = useMemo(() => {
        return course.benefits
            ? course.benefits.split("\n").filter((item: string) => item.trim() !== "")
            : [];
    }, [course.benefits]);

    if (benefitsList.length === 0) return null;

    return (
        <div className="what-you-learn-box">
            <h3 className="box-title">Bạn sẽ học được gì?</h3>
            <div className="learn-grid">
                {benefitsList.map((item: string, idx: number) => (
                    <div key={idx} className="learn-item">
                        <i className="bi bi-check-lg"></i>
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
