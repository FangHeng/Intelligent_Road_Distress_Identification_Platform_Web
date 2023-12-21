import React from 'react';
import { observer } from "mobx-react-lite";
import { Navigate, useLocation } from 'react-router-dom';
import userStore from "../../store/UserStore";

const ProtectedRoute = observer(({ children }) => {
    const location = useLocation();

    if (!userStore.isLoggedIn) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
});

export default ProtectedRoute
