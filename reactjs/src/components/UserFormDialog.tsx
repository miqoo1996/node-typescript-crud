import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {UsersStoreInterface, UserType} from "../stoeMobX/UsersStore";
import {FormEvent, useContext, useRef} from "react";
import {AppContext} from "../contexts/AppContext";
import axios, {AxiosError} from "axios";
import {observer} from "mobx-react";

type UserFormDialogProps = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleClickOpenDialog?: () => void,
    handleCloseDialog: () => void,
    store: UsersStoreInterface,
};

type SaveResponseType = {
    message?: string,
    usersCount?: number,
    user?: UserType,
};

export default observer(function UserFormDialog({store, open, setOpen, handleCloseDialog} : UserFormDialogProps) {
    const user = store.getSelectedUser();

    const { apiUrl } = useContext(AppContext);

    const formRef = useRef() as React.MutableRefObject<HTMLFormElement>;

    const onFormSaveFailure = (response: AxiosError) => {
        const { errors } : any = response.response?.data;
        if (errors?.[0]?.msg) {
            alert(errors?.[0]?.param + ': ' + errors?.[0]?.msg);
        }
    };

    const onFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        let response:SaveResponseType;

        if (store.selectedUser.id) {
            response = await axios.put(`${apiUrl}/user/${store.selectedUser.id}`, user).then(data => data.data).catch(onFormSaveFailure);
            if (response) {
                store.setSelectedUser(user, true);
            }
        } else {
            response = await axios.post(`${apiUrl}/user`, user).then(data => data.data).catch(onFormSaveFailure);
            if (response.user) {
                store.addUser(response.user);
            }
        }

        if (response) {
            setOpen(false);
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create Or Modify selected user.
                    </DialogContentText>
                    <form onSubmit={onFormSubmit} ref={formRef}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Id"
                            type="text"
                            fullWidth
                            variant="standard"
                            hidden={true}
                            defaultValue={user.id}
                            onChange={e => {
                                if (e.currentTarget.value) {
                                    store.selectedUser.id = parseInt(e.currentTarget.value);
                                }
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="First Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={user.firstName}
                            onChange={e => {
                                store.selectedUser.firstName = e.currentTarget.value;
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Last Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={user.lastName}
                            onChange={e => {
                                store.selectedUser.lastName = e.currentTarget.value;
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="age"
                            label="Age"
                            type="number"
                            fullWidth
                            variant="standard"
                            defaultValue={user.age || ''}
                            onChange={e => {
                                if (e.currentTarget.value) {
                                    store.selectedUser.age = parseInt(e.currentTarget.value);
                                }
                            }}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={onFormSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});
