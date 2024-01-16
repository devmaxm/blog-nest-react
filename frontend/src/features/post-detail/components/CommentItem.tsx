import {useState} from 'react'
import { Button, Grid } from "@mui/material";
import { IComment } from "../../../types/general/post";
import { Link } from "react-router-dom";
import { dateTimeFormatInstance } from "../../../lib/intl";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import styles from "./PostDetail.module.css";
import { useAppDispatch } from "../../../hooks/store";
import { createCommentThunk, likeCommentThunk, removeCommentLikeThunk } from "../../../store/slices/post";

type PropsType = {
  postId: number
  comment: IComment;
};
export function CommentItem(props: PropsType) {
  const [commentBody, setCommentBody] = useState<string>('')
  const [isActiveForm, setIsActiveForm] = useState<boolean>(false)
  const { comment, postId } = props;
  const dispatch = useAppDispatch()

  const handleLike = () => {
    if (comment.isLiked) {
      dispatch(removeCommentLikeThunk({commentId: comment.id, postId}))
    } else {
      dispatch(likeCommentThunk({commentId: comment.id, postId}))
    }
  }

  const handleForm = () => {
    setIsActiveForm(!isActiveForm)
  }

  const handleComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(createCommentThunk({body: commentBody, postId, parentId: comment.id}))
    handleForm()
    setCommentBody('')
  }

  const children = comment.children.map((child) => (
    <CommentItem key={child.id} comment={child} postId={postId} />
  ));
  return (
    <Grid container marginLeft="20px" marginBottom="15px">
      <Grid item xs={12} xl={12}>
        {" "}
        <Link to="/">{comment.author.username}</Link>{" "}
        <span className="text">
          {dateTimeFormatInstance.format(new Date(comment.createdAt))}
        </span>{" "}
      </Grid>
      <Grid item xs={12} xl={12}>
        {" "}
        {comment.body}{" "}
      </Grid>
      <Grid item xs={12} xl={12}>
        <button onClick={handleForm}>Reply</button>
        <button className={styles.post__like_btn} onClick={handleLike}>
          {comment.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </button>
        {comment.likesCount}
      </Grid>
      <form className={`${styles.comment__reply_form} ${isActiveForm && styles.active}`} onSubmit={handleComment}>
        <input placeholder='text' value={commentBody} onChange={(event) => setCommentBody(event.target.value)}/>
        <button type='submit'>Reply</button>
      </form>
      {children && children}
    </Grid>
  );
}
