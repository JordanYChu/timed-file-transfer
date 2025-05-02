
import { User, UserCredential } from "firebase/auth";
import { createContext, useState } from "react"
import { useNavigate } from "react-router";

export type UserProps = {
    uid: string | null,
    name: string | null,
    email: string | null
    picture: string | null;
}

type UserAuth = {
    user: UserProps | null,
    login: (user: User) => void,
    logout: () => void
}

export const AuthContext = createContext<UserAuth>({});

const AuthProvider = ({ children }: any) => {

    const navigate = useNavigate();
    const [user, setUser] = useState<UserProps | null>(null);

    const login = (user: User) => {
        setUser({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            picture: user.photoURL
        });
        alert("logged in probably");
        navigate("/dashboard")
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