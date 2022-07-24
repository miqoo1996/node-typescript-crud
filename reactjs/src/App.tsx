import React from 'react';
import styled from "styled-components";
import './App.css';
import Users from "./components/Users";
import UsersStore from "./stoeMobX/UsersStore";
import {AppContext, AppContextDefault} from "./contexts/AppContext";

const UsersWrapper = styled.div`
    margin-top: 40px;
`;

function App() {
    return (
        <AppContext.Provider value={{ ...AppContextDefault }}>
            <div className="container-fluid">
                <div className='flex-wrap app-wrapper'>
                    <div className='row'>
                        <UsersWrapper>
                            <Users store={UsersStore} />
                        </UsersWrapper>
                    </div>
                </div>
            </div>
        </AppContext.Provider>
    );
}

export default App;
