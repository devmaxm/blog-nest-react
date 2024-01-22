import { Grid } from "@mui/material";
import { useAppDispatch } from "../../../hooks/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { TRootState } from "../../../types/store/store";
import { fetchNotificationsThunk } from "../../../store/slices/notifications";
import Loader from "../../../components/Loader/Loader";
import { NotificationItem } from "./NotificationItem";

export function AllNotifications() {
    const dispatch = useAppDispatch()
    const {notifications, fetching} = useSelector((store: TRootState) => store.notifications)

    useEffect(() => {
        dispatch(fetchNotificationsThunk())
    }, [])

    if (fetching === 'pending') {
        return <Loader />
    }
    return <Grid container className='container'>
        <h1>Notifications</h1>
        <Grid container>
        {!notifications && <p>Notifications not found.</p>}
        {notifications && notifications.map(notification => <NotificationItem key={notification.id} notification={notification}/>)}
        </Grid>
        

    </Grid>
}