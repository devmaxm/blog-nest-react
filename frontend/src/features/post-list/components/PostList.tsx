import { Grid } from "@mui/material";
import { PostItem } from "./PostItem";
import styles from './PostList.module.css'
import { useAppDispatch } from "../../../hooks/store";
import { useEffect } from "react";
import { fetchPostsThunk } from "../../../store/slices/feed";
import { TRootState } from "../../../types/store/store";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader/Loader";

export function PostList() {
  const dispatch = useAppDispatch()
  const {postList, fetching} = useSelector((state: TRootState) => state.feed)

  useEffect(() => {
    dispatch(fetchPostsThunk())
  }, [])

  if (fetching == 'pending') {
    return <Loader />
  }
  return (
    <Grid container className="container">
      <h1 className={styles.posts_title}>Posts</h1>
      <Grid container className={styles.post_items}>
        {!postList && <p>Posts not found.</p>}
        {postList && postList.data.map(post => <PostItem key={post.id} post={post}/>)}
      </Grid>
    </Grid>
  );
}
