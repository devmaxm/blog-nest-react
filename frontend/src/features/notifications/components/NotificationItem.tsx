import { Grid } from "@mui/material"
import { INotification } from "../../../types/general/notification"
import { Link } from "react-router-dom"
import styles from './Notifications.module.css'

type PropsType = {
    notification: INotification
}

export function NotificationItem(props: PropsType) {
    const {notification} = props
    return <Grid  container className={styles.notification_item}>
        <h3>
        {notification.post &&<Link to={`/posts/${notification.post.id}`}> {notification.post.title}</Link>}
        {notification.comment &&<Link to={`/posts/${notification.comment.post.id}`}> {notification.comment.post.title}</Link>}
        </h3>
        <Grid item xs={12} xl={12}>
        <p>{notification.message}</p>
        </Grid>
    </Grid>
}