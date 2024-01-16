import * as React from 'react';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

import {Dayjs} from "dayjs";

import {useController, UseControllerProps} from 'react-hook-form'



type PropsType = {
    controller: UseControllerProps<any>
}


export default function DefaultDatePicker(props: PropsType) {
    const {field, fieldState: {error}} = useController(props.controller);

    const handleDate = (data: Dayjs | null) => {
        if (data) {
            const date = data.format().split('T')[0]
            field.onChange(data)
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="Працевлаштований з"
                {...field}
                onChange={handleDate}
            />
            {/*{error && <p className='error_text'>{error.message}</p>}*/}
        </LocalizationProvider>

    );
}
