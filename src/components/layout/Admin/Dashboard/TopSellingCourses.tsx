import React from 'react';
import { TopCourse } from '../../../../api/DashboardAPI';

interface TopSellingCoursesProps {
    courses: TopCourse[];
}

export default function TopSellingCourses({ courses }: TopSellingCoursesProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text-main">Top Selling Courses</h3>
                <button className="text-primary text-sm font-medium hover:underline">View All</button>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="space-y-4">
                    {courses.map((course, index) => (
                        <div key={course.courseId} className="flex items-center gap-4 p-3 rounded-lg hover:bg-background-light transition-colors border border-transparent hover:border-border-subtle">
                            <div className={`flex items-center justify-center size-8 rounded-full font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                    index === 1 ? 'bg-gray-100 text-gray-700' :
                                        index === 2 ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-50 text-blue-700'
                                }`}>
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-main truncate">{course.courseName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${course.percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-text-secondary">{course.percentage}%</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-text-main">{formatCurrency(course.revenue)}</p>
                            </div>
                        </div>
                    ))}

                    {courses.length === 0 && (
                        <div className="text-center text-text-secondary py-8">
                            No data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
