import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TopCourse } from '../../../../api/DashboardAPI';

interface TopCoursesChartProps {
    data: TopCourse[];
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

export const TopCoursesChart: React.FC<TopCoursesChartProps> = ({ data }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value);
    };

    return (
        <div className="chart-card">
            <h5 className="chart-title">Top khóa học bán chạy</h5>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percentage }: any) => `${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number, _name: any, props: any) => [formatCurrency(props.payload.revenue), props.payload.courseName]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            <div className="top-courses-list">
                {data.map((course, index) => (
                    <div key={course.courseId} className="top-course-item">
                        <div className="course-rank" style={{ backgroundColor: COLORS[index] }}>
                            {index + 1}
                        </div>
                        <div className="course-info">
                            <span className="course-name">{course.courseName}</span>
                            <span className="course-revenue">{formatCurrency(course.revenue)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
