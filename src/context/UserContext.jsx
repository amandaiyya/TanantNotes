"use client";
import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext({
    user: null,
    tenant: null,
    login: () => {},
    logout: () => {},
    upgradeSubscription: () => {}
})

const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [tenant, setTenant] = useState(null);

    const upgradeSubscription = () => {
        const updatedTenant = {...tenant, plan: "pro"};

        localStorage.setItem("tenant", JSON.stringify(updatedTenant));
        setTenant(updatedTenant);
    }

    const login = (userData, tenantData) => {
        setUser(userData);
        setTenant(tenantData);
    }

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("tenant");

        setUser(null);
        setTenant(null);
    }

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        const tenantData = JSON.parse(localStorage.getItem("tenant"));

        setUser(userData);
        setTenant(tenantData);
    },[])

    return (
        <UserContext.Provider value={{user, setUser, tenant, setTenant, login, logout, upgradeSubscription}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext);

export default UserContextProvider;