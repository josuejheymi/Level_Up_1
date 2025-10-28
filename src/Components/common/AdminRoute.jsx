// Components/common/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useUser } from "../user/UserContext";

export default function AdminRoute({ children }) {
    const { currentUser } = useUser();

    if (!currentUser || currentUser.role !== "admin") {
        return <Navigate to="/login" />;
    }

    return children;
}
