import {useEffect} from "react";
import {NavLink} from "react-router-dom";

import s from './Auth.module.css'

import {registerThunk, setError} from "store/slices/auth";
import {useAppDispatch} from "hooks/store";
import {useSelector} from "react-redux";
import {TRootState} from "types/store/store";

import {Alert, Button, Grid} from "@mui/material";
import Loader from "components/Loader/Loader";
import {SubmitHandler, useForm} from "react-hook-form";
import Input from "components/Form/Input/Input";

type Inputs = {
    username: string;
    password: string;
    password2: string;
}

function RegisterForm() {
    const {register, handleSubmit, formState: {errors}} = useForm<Inputs>({mode: "onChange"})
    const {error, fetching} = useSelector((state: TRootState) => state.auth)
    const dispatch = useAppDispatch()

    useEffect(() => {

        dispatch(setError(''))
    }, [dispatch])


    const handleRegister: SubmitHandler<Inputs> = (data) => {
        dispatch(registerThunk({
            username: data.username,
            password: data.password,
            password2: data.password2
        }))
    }

    if (fetching === 'pending') {
        return <Loader/>
    }

    return (
        <Grid container className='container'>
            <Grid item container className={s.auth}>
                <form onSubmit={handleSubmit(handleRegister)} className={s.auth_form}>
                    <h1 className='form_item'>Реєстрація</h1>
                    {error && <Alert severity="error" className={s.form__item}>{error}</Alert>}

                    <Input
                        id='username'
                        label={`Ім'я користувача`}
                        register={register('username', {
                            required: `Обов'язкове поле`,
                            minLength: {
                                value: 4,
                                message: 'Мінімальна давжина поля 4 символа'
                            }
                        })}
                        error={errors.username?.message}
                    />

                    <Input
                        id='password'
                        register={register('password', {
                            required: `Обов'язкове поле`,
                            minLength: {
                                value: 6,
                                message: 'Мінімальна давжина поля 6 символів'
                            }
                        })}
                        label="Пароль"
                        type='password'
                        error={errors.password?.message}
                    />

                    <Input
                        id='password2'
                        register={register('password2', {
                            required: `Обов'язкове поле`,
                            minLength: {
                                value: 7,
                                message: 'Мінімальна довжина пароля 7 символів'
                            }
                        })}
                        label="Повторіть пароль"
                        type='password'
                        error={errors.password2?.message}
                    />

                    <p className='form_item text'>
                        Зареєстровані? <NavLink to='/a/login'>Вхід</NavLink>
                    </p>
                    <Button variant="outlined" type='submit' className='form_item'>Зареєструватися</Button>

                </form>
            </Grid>
        </Grid>
    )
}

export default RegisterForm