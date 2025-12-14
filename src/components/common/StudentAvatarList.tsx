import React, { useEffect, useState } from 'react';
import '../../style/StudentAvatarList.css';
import { Student } from '../../model/UserModel';
import { getStudentsByCourseId } from '../../api/CourseAPI';


interface StudentAvatarListProps {
    courseId: number;
}

export const StudentAvatarList: React.FC<StudentAvatarListProps> = ({ courseId }) => {
    // Mock data if no students provided
    const [students, setStudents] = useState<Student[]>([]);
    const [totalStudents, setTotalStudents] = useState<number>(0);

    useEffect(() => {
        const fecthStudents = async () => {
            try {
                const res = await getStudentsByCourseId(courseId);
                setStudents(res);
                setTotalStudents(res.length);
            } catch (err) {
                console.log(err);
            }
        };
        fecthStudents();
    }, [courseId]);

    return (
        <div className="student-avatar-list">
            <div className="avatar-group">
                {students.slice(0, 5).map((student) => (
                    <img
                        key={student.id}
                        src={student.avatarUrl}
                        alt={student.name}
                        className="student-avatar"
                        title={student.name}
                    />
                ))}
                <div className="more-students">
                    +{totalStudents > 5 ? totalStudents - 5 : 0}
                </div>
            </div>
            <div className="students-label">
                <span>{totalStudents.toLocaleString()}</span> học viên đang học
            </div>
        </div>
    );
};
