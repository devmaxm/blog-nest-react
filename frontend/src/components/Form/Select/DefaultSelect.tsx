import {FormControl, InputLabel, MenuItem, NativeSelect, Select} from "@mui/material";
import {useController, UseControllerProps} from "react-hook-form";

type OptionType = {
    name: string;
    value: string;
}

type PropsType = {
    label: string
    controller: UseControllerProps<any>
    options: OptionType[]
}


function DefaultSelect(props: PropsType) {
    const {field} = useController(props.controller)

    const options = props.options.map((option) => {
        return <MenuItem value={option.value}>{option.name}</MenuItem>
    })

    return <FormControl fullWidth variant="standard">
        <InputLabel variant="standard">
            {props.label}
        </InputLabel>
        <Select
            {...field}
        >
            {options}
        </Select>
    </FormControl>
}

export default DefaultSelect