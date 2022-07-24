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
import {UsersStoreInterface} from '../stoeMobX/UsersStore';
import {SyntheticEvent, useContext, useEffect, useState} from "react";
import {AppContext} from "../contexts/AppContext";
import Button from '@mui/material/Button';
import {GridSelectionModel} from "@mui/x-data-grid/models/gridSelectionModel";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";

interface usersProp {
    store: UsersStoreInterface,
}

const Users = ({store}: usersProp) => {
    const [columns, setColumns] = useState<GridColDef[]>([]);

    const { apiUrl } = useContext(AppContext);

    const [isLoaded, setIsLoaded] = useState<boolean>(false);

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

        alert(row.id)

        return JSON.stringify(row, null, 4);
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
                width: 200,
                renderCell: (params: GridRenderCellParams) => {
                    return <>
                        <Button onClick={e => handleDeleteClick(e, params)}>Delete</Button>
                        <Button onClick={e => handleUpdateClick(e, params)}>Update</Button>
                    </>;
                },
            }
        ];

        setColumns(columns);

        store.init(apiUrl);

        setIsLoaded(true);
    }, []);

    const onSelectionChange = (selectionModel: GridSelectionModel, details: GridCallbackDetails) : void => {
        console.log(selectionModel, details);
    };

    return (
        <div style={{ height: 800, width: '100%' }}>
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