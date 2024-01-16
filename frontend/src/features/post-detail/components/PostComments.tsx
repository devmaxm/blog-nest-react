import { Grid } from "@mui/material";
import { IComment } from "../../../types/general/post";
import { CommentItem } from "./CommentItem";
import { useAppDispatch } from "../../../hooks/store";
import { createCommentThunk } from "../../../store/slices/post";
import { useState } from "react";
import { Form } from "react-router-dom";

type PropsType = {
  postId: number;
  comments: IComment[];
};

export function PostComments(props: PropsType) {
  const [commentBody, setCommentBody] = useState<string>("");
  const { comments, postId } = props;

  const dispatch = useAppDispatch();
  const handleComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(createCommentThunk({ body: commentBody, postId }));
    setCommentBody("");
  };

  return (
    <Grid container>
      <Grid marginBottom='30px'>
        <form onSubmit={handleComment}>
          <input
            placeholder="text"
            value={commentBody}
            onChange={(event) => setCommentBody(event.target.value)}
          />
          <button type="submit">Send Comment</button>
        </form>
      </Grid>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </Grid>
  );
}
