import {TextField} from "@mui/material";
import s from "./Input.module.css";
import {useController, UseControllerProps} from "react-hook-form";

type PropsType = {
    label: string
    controller: UseControllerProps<any>
}

function DefaultInput(props: PropsType) {
    const {field, fieldState: {error}} = useController(props.controller);

    return (
        <div className='form_item'>
            <TextField
                label={props.label}
                variant="standard"
                className={s.form_input}
                {...field}
            />
            {error && <p className='error_text'>{error.message}</p>}
        </div>
    )
}

export default DefaultInput