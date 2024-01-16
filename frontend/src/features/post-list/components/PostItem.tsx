import { Grid } from "@mui/material";
import styles from "./PostList.module.css";
import { IPost } from "../../../types/general/post";
import { dateTimeFormatInstance } from "../../../lib/intl";
import { Link } from "react-router-dom";

type PropsType = {
  post: IPost
};

export function PostItem(props: PropsType) {
  const {post} = props
  return (
    <Grid
      container
      item
      className={styles.post_item}
      xl={12}
      xs={12}
      marginBottom="20px"
    >
      <Grid container marginBottom='10px'>
        <p className='text'>Author: <span>{post.author.username}</span></p>
        <p className={styles.post__created_at + " " +"text"}>{dateTimeFormatInstance.format(new Date(post.createdAt))}</p>
      </Grid>
      <Grid item xl={12} xs={12} marginBottom='10px'><Link className="text_title" to={`posts/${post.id}`}>{post.title}</Link></Grid>
      <Grid item xl={12} xs={12}><p>{post.body}</p></Grid>
    </Grid>
  );
}
