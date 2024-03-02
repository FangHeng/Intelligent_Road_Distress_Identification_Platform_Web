import React from 'react';
import { observer } from "mobx-react-lite";
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = observer(({ children }) => {
    const location = useLocation();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
});

export default ProtectedRoute
