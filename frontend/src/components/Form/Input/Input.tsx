import s from "./Input.module.css";

import {TextField} from "@mui/material";

type PropsType = {
    id: string;
    label: string;
    type?: string;
    register: any;
    error: string | undefined;
}

function Input(props: PropsType) {
    return (
        <div className='form_item'>
            <TextField
                id={props.id}
                label={props.label}
                variant="standard"
                type={props.type || 'text'}
                className={s.form_input}
                {...props.register}
            />
            {props.error && <p className='error_text'>{props.error}</p>}
        </div>
    )
}

export default Input