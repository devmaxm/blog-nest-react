import {Button, Grid} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useEffect} from "react";
import s from './Modal.module.css'
import {createPortal} from "react-dom";
import {useAppDispatch} from "hooks/store";
import {ActionCreatorWithPayload, AnyAction, AsyncThunk, Dispatch} from "@reduxjs/toolkit";

type PropsType = {
    isActive: boolean;
    toggleModal: ActionCreatorWithPayload<{ id?: number }>;

    deleteFunction: AsyncThunk<{ id: number }, { id: number },
        {
            rejectValue: string;
            state?: unknown;
            dispatch?: Dispatch<AnyAction> | undefined;
            extra?: unknown;
            serializedErrorType?: unknown;
            pendingMeta?: unknown;
            fulfilledMeta?: unknown;
            rejectedMeta?: unknown;
        }>;
    id: number | null;
}

function DeleteModal(props: PropsType) {
    const {isActive, toggleModal, deleteFunction, id} = props
    const dispatch = useAppDispatch()

    useEffect(() => {
        document.body.className = isActive ? '' : 'modal_open'
    }, [])

    const handleModalOpen = () => {
        document.body.className = isActive ? '' : 'modal_open'
        dispatch(toggleModal({}))
    }

    const handleDelete = () => {
        if (id) {
            dispatch(deleteFunction({id}))
        }
        handleModalOpen()
    }

    return (
        createPortal(
            <Grid container className={`${s.modal_page} ${isActive && s.active}`}>
                <Grid item container className={s.modal}>
                    <Grid container item xs={12} className={s.modal_top}>
                        <h3>Видалення</h3>
                        <button className={s.button__close_modal} onClick={handleModalOpen}>
                            <CloseIcon/>
                        </button>
                    </Grid>

                    <Grid item xs={12} className={s.modal_main}>
                        <p className='text'>
                            Ви впевнені, що хочете видалити запис?
                        </p>
                    </Grid>

                    <Grid container item xs={12} className={s.modal_footer}>
                        <Grid item xs={6} className={s.modal_footer__item}>
                            <Button
                                variant="contained"
                                className={s.button}
                                onClick={handleModalOpen}
                            >Скасувати</Button>
                        </Grid>
                        <Grid item xs={6} className={s.modal_footer__item}>
                            <Button
                                variant="outlined"
                                color="error"
                                className={s.button}
                                onClick={handleDelete}
                            >Видалити
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>, document.body
        )
    )
}

export default DeleteModal