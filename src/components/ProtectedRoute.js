import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
// защищаем роут главной страницы от неавторизованных пользователей
export default function ProtectedRoute({ isLoggedIn }) {
  return isLoggedIn ? <Outlet /> : <Navigate to='sign-in' replace />;
};