import { Button, Grid } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import styles from "./PostDetail.module.css";

import { useAppDispatch } from "../../../hooks/store";
import { useEffect } from "react";
import { TRootState } from "../../../types/store/store";
import { fetchPostThunk } from "../../../store/slices/post";
import { useSelector } from "react-redux";
import { PostInfo } from "./PostInfo";
import { PostComments } from "./PostComments";

export function PostDetail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { post } = useSelector((store: TRootState) => store.post);
  useEffect(() => {
    id && dispatch(fetchPostThunk({ id }));
  }, []);

  if (!post) {
    return <div>Post not found</div>;
  }
  return (
    <Grid container className="container">
      <PostInfo post={post} />
      <PostComments comments={post.comments} postId={post.id}/>
    </Grid>
  );
}
