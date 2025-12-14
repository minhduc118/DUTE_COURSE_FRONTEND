import React from 'react';

import './style/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/layout/Admin/AdminLayout';
import ListUsers from './components/layout/Admin/User/ListUser';
import ListCourses from './components/layout/Admin/Course/ListCourse';
import AdminCourseDetailPage from './components/layout/Admin/Course/CourseDetailPage';
import ListOrder from './components/layout/Admin/Order/ListOrder';
import Dashboard from './components/layout/Admin/Dashboard/Dashboard';
import CustomerLayout from './components/layout/Customer/CustomerLayout';
import HomePage from './page/HomePage';
import CustomerCourseDetailPage from './page/CourseDetailPage';
import CourseLearningPage from './page/CourseLearningPage';
import PaymentPage from './page/PaymentPage';
import LoginPage from './page/LoginPage';
import RegisterPage from './page/RegisterPage';
import GoogleCallbackPage from './page/GoogleCallbackPage';
import { AuthProvider } from './context/AuthContext';
import MyCoursesPage from './page/MyCoursesPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer layout (public pages) */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="roadmap" element={<div className="container p-5"><h1>Lộ trình học tập</h1></div>} />
            <Route path="articles" element={<div className="container p-5"><h1>Bài viết</h1></div>} />
            <Route path="my-courses" element={<MyCoursesPage />} />
            <Route path="courses/:slug" element={<CustomerCourseDetailPage />} />
          </Route>

          {/* Course Learning Page - No layout wrapper */}
          <Route path="courses/:slug/learn" element={<CourseLearningPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Auth pages - No layout wrapper */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

          {/* Admin layout (own sidebar) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<ListUsers />} />
            <Route path="products" element={<ListCourses />} />
            <Route path="products/:slug" element={<AdminCourseDetailPage />} />
            <Route path="orders" element={<ListOrder />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
