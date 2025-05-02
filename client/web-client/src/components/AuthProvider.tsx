
import { createContext, useState } from "react"

const AuthContext = createContext({});

const AuthProvider = ({ children }: any) => {

    const [user, setUser] = useState<string | null>(null);

    const login = (user: string) => {
        setUser(user);
        alert("logged in probably");
    }
    const logout = () => {
        setUser(null);
        alert("Logged out Probably");
    }

    const values = {
        user,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={values} >
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider