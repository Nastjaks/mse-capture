import React, {ReactNode} from "react";

export const NavbarContext = React.createContext<any>(undefined);

interface NavBarProviderProps {
    children: ReactNode;
}
export const NavBarProvider: React.FC<NavBarProviderProps> = ({ children }) => {
    const [showTabs,setShowTabs]=React.useState(true);

    let state = {
        showTabs,
        setShowTabs,
    };

    return <NavbarContext.Provider value={state}>{children}</NavbarContext.Provider>;

}

export default NavbarContext;
