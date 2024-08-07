import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'reduxDir/store';

export default function AuthRoute() {
    const isAuthenticated = useSelector((state: RootState) => state.user.token);

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
