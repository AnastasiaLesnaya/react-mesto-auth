import React from 'react';
import { Navigate } from 'react-router-dom';
// защищаем роут главной страницы от неавторизованных пользователей
export default function ProtectedRoute({ element: Component, ...props }) {
  return props.isLoggedIn ? (
    <Component {...props} />
    ) : (
      <Navigate to="/sign-in" replace />
    );
};