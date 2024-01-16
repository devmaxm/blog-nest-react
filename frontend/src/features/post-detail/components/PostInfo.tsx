import {  Grid } from "@mui/material"
import { Link } from "react-router-dom"
import styles from "./PostDetail.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IPostDetail } from "../../../types/general/post";
import { dateTimeFormatInstance } from "../../../lib/intl";
import { useAppDispatch } from "../../../hooks/store";
import { likePostThunk, removePostLikeThunk } from "../../../store/slices/post";

type PropsType = {
    post: IPostDetail
}
export function PostInfo(props: PropsType) {
    const {post} = props
    const dispatch = useAppDispatch()
    const handleLike = () => {
      if (post.isLiked) {
        dispatch(removePostLikeThunk({postId: post.id}))
      } else {
        dispatch(likePostThunk({postId: post.id}))
      }
    }

    return <Grid container className={styles.post__container}>
    <Grid item xs={12} xl={12}>
      <p className="text">
        <Link to="" className="text_title">
          {post.author.username}
        </Link>{" "}
        <span className={styles.post__created_at}>{dateTimeFormatInstance.format(new Date(post.createdAt))}</span>
      </p>
    </Grid>
    <Grid item xs={12} xl={12}>
      <h1>{post.title}</h1>
    </Grid>
    <Grid item xs={12} xl={12}>
      {post.body}
    </Grid>
    <Grid container item>
      <button className={styles.post__like_btn} onClick={handleLike}>
      {post.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </button>
      {post.likesCount}
    </Grid>
  </Grid>
}