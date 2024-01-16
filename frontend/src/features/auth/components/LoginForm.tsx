import s from './Auth.module.css'

import {NavLink} from "react-router-dom";
import {Alert, Button, Grid} from "@mui/material";
import Loader from "components/Loader/Loader";
import Input from "components/Form/Input/Input";

import {loginThunk, setError} from "store/slices/auth";
import {useAppDispatch} from "hooks/store";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {TRootState} from "types/store/store";
import {SubmitHandler, useForm} from "react-hook-form";


type Inputs = {
    username: string;
    password: string
}

function LoginForm() {
    const {register, handleSubmit, formState: {errors}} = useForm<Inputs>({mode: "onChange"})
    const {error, fetching} = useSelector((state: TRootState) => state.auth)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setError(''))
    }, [dispatch])

    const handleLogin: SubmitHandler<Inputs> = (data) => {
        dispatch(loginThunk({
            email: data.username,
            password: data.password
        }))
    }

    if (fetching === 'pending') {
        return <Loader/>
    }

    return (
        <Grid container className='container'>
            <Grid item container className={s.auth}>
                <form onSubmit={handleSubmit(handleLogin)} className={s.auth_form}>
                    <h1 className='form_item'>Вхід</h1>
                    {error && <Alert severity="error" className={s.form__item}>{error}</Alert>}

                    <Input
                        id='username'
                        label={`Ім'я користувача`}
                        register={register('username', {
                            required: `Обов'язкове поле`
                        })}
                        error={errors.username?.message}
                    />
                    <Input
                        id='password'
                        register={register('password', {
                            required: `Обов'язкове поле`,
                        })}
                        label="Пароль"
                        type='password'
                        error={errors.password?.message}
                    />
                    <p className='form_item text'>
                        Не зареєстровані? <NavLink to='/a/register'>Зареєструватися</NavLink>
                    </p>
                    <Button variant="outlined" type='submit' className='form_item'>Увійти</Button>

                </form>
            </Grid>
        </Grid>
    )
}

export default LoginForm