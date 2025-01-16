import React from "react";

export const NavbarContext = React.createContext<any>(undefined);

export const NavBarProvider: React.FC = ({ children }) => {
    const [showTabs,setShowTabs]=React.useState(true);

    let state = {
        showTabs,
        setShowTabs,
    };

    return <NavbarContext.Provider value={state}>{children}</NavbarContext.Provider>;

}

export default NavbarContext;
