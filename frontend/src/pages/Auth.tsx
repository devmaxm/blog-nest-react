import {Navigate, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import {TRootState} from "../types/store/store";


export function Auth() {
    const {isAuth} = useSelector((state: TRootState) => state.auth)

    if (isAuth) {
        return <Navigate to='/'/>
    }
    return <Outlet/>
}

export default Auth