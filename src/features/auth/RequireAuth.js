import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
//if there is a role assigned to the user he will receive all the children components from outlet 
// this is to protect the app if someone would try to go to endpoints from browser url
// user with no role will be sent to login page while replace propery will save user log in if back button is pressed
const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const { roles } = useAuth()

    const content = (
        roles.some(role => allowedRoles.includes(role))
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )

    return content
}
export default RequireAuth