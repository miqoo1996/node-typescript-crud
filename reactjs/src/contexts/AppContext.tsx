import React from "react";

const AppContextDefault = {
    apiUrl: 'http://localhost:3001'
};

const AppContext = React.createContext(AppContextDefault);

export {
    AppContext,
    AppContextDefault,
}