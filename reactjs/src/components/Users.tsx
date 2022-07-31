import * as React from 'react';
import {observer} from "mobx-react";
import {
    DataGrid,
    GridApi,
    GridCellValue,
    GridColDef,
    GridRenderCellParams,
    GridValueGetterParams
} from '@mui/x-data-grid';
import {UsersStoreInterface, UserType} from '../stoeMobX/UsersStore';
import {SyntheticEvent, useContext, useEffect, useState} from "react";
import {AppContext} from "../contexts/AppContext";
import Button from '@mui/material/Button';
import {GridSelectionModel} from "@mui/x-data-grid/models/gridSelectionModel";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";
import styled from "styled-components";
import UserFormDialog from "./UserFormDialog";
import axios from "axios";

const ButtonActionsWrapper = styled.div`
    display: flex;
    column-gap: 10px;
    flex-wrap: wrap;
    margin-bottom: ${({bottom}: {bottom?: any}) => bottom | 0}px;
`;

interface usersProp {
    store: UsersStoreInterface,
}

const Users = ({store}: usersProp) => {
    const [columns, setColumns] = useState<GridColDef[]>([]);

    const { apiUrl } = useContext(AppContext);

    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const [open, setOpen] = React.useState<boolean>(false);

    const getRow = (params:  GridRenderCellParams): Record<string, GridCellValue> => {
        const api: GridApi = params.api;
        const thisRow: Record<string, GridCellValue> = {};

        api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
                (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );

        return thisRow;
    }

    const handleDeleteClick = (e: SyntheticEvent, params:  GridRenderCellParams) => {
        e.stopPropagation(); // don't select this row after clicking

        const row = getRow(params);

        store.deleteUser(row.id as number)

        return JSON.stringify(row, null, 4);
    };

    const handleUpdateClick = (e: SyntheticEvent, params:  GridRenderCellParams) => {
        e.stopPropagation(); // don't select this row after clicking

        const row = getRow(params);

        setOpen(true);

        store.setSelectedUser(row as UserType);

        return JSON.stringify(row, null, 4);
    };

    const handleClickOpenDialog = () : void => {
        store.clearSelectedUser();

        setOpen(true);
    };

    const handleDeleteAll = () : void => {
        store.setUsers(store.getUsers().filter(user => store.usersActionList.indexOf(user.id as number) === -1));

        store.usersActionList.map((userId: number) : void => {
            axios.delete(`${apiUrl}/user/${userId}`);
        });

        store.usersActionList = [];
    };

    const handleCloseDialog = () : void => {
        setOpen(false);
    };

    useEffect(() => {
        const columns: GridColDef[] = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'firstName', headerName: 'First name', width: 130 },
            { field: 'lastName', headerName: 'Last name', width: 130 },
            {
                field: 'age',
                headerName: 'Age',
                type: 'number',
                width: 90,
            },
            {
                field: 'fullName',
                headerName: 'Full name',
                description: 'This column has a value getter and is not sortable.',
                sortable: false,
                width: 160,
                valueGetter: (params: GridValueGetterParams) =>
                    `${params.row.firstName || ''} ${params.row.lastName || ''}`,
            },
            {
                field: "action",
                headerName: "Action Buttons",
                sortable: false,
                width: 250,
                renderCell: (params: GridRenderCellParams) => {
                    return <ButtonActionsWrapper>
                        <Button color="error" variant='contained' onClick={e => handleDeleteClick(e, params)}>Delete</Button>
                        <Button color="info" variant='contained' onClick={e => handleUpdateClick(e, params)}>Update</Button>
                    </ButtonActionsWrapper>;
                },
            }
        ];

        setColumns(columns);

        store.init(apiUrl);

        setIsLoaded(true);
    }, []);

    const onSelectionChange = (selectionModel: GridSelectionModel, details: GridCallbackDetails) : void => {
        store.usersActionList = selectionModel as number[];
    };

    return (
        <div style={{ height: 800, width: '100%' }}>
            <ButtonActionsWrapper bottom='10'>
                <Button variant="outlined" onClick={handleClickOpenDialog}>
                    Create
                </Button>
                {store.usersActionList.length ? (
                    <Button variant="outlined" color='error' onClick={handleDeleteAll}>
                        Delete all
                    </Button>
                ) : null}
            </ButtonActionsWrapper>

            <UserFormDialog
                store={store}
                open={open}
                setOpen={setOpen}
                handleClickOpenDialog={handleClickOpenDialog}
                handleCloseDialog={handleCloseDialog}
            />

            <DataGrid
                rows={[...store.getUsers()]}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                onSelectionModelChange={onSelectionChange}
            />
        </div>
    );
}

export default observer(Users);