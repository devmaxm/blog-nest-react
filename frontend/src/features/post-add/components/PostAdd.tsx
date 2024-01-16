import { Button, Grid } from "@mui/material";
import { Navigate } from "react-router-dom";
import Input from "components/Form/Input/Input";
import { TRootState } from "../../../types/store/store";
import { useSelector } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "../../../hooks/store";
import { createPostThunk } from "../../../store/slices/post";
import { useNavigate  } from "react-router-dom";

type Inputs = {
  title: string;
  body: string;
};

export function PostAdd() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const { post } = useSelector((state: TRootState) => state.post);
  const handleCreatePost: SubmitHandler<Inputs> = (data) => {
    dispatch(
      createPostThunk({
        title: data.title,
        body: data.body,
      })
    );
      return navigate(`/`)
  };

  return (
    <Grid container className="container">
      <Grid item xs={12} xl={12}>
        <form onSubmit={handleSubmit(handleCreatePost)}>
          <h1 className="form_item">Post create</h1>
          <Input
            id="title"
            label={`Title`}
            register={register("title", {
              required: `Required field`,
            })}
            error={errors.title?.message}
          />
          <Input
            id="body"
            register={register("body", {
              required: `Required field`,
            })}
            label="Content"
            error={errors.body?.message}
          />
          <Button variant="outlined" type="submit" className="form_item">
            Create Post
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}
