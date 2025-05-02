
import { User, UserCredential } from "firebase/auth";
import { createContext, useState } from "react"
import { useNavigate } from "react-router";

export type UserProps = {
    uid: string | null,
    name: string | null,
    token: string | null;
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

    const login = async (user: User) => {
        await setUser({
            uid: user.uid,
            name: user.displayName,
            token: await user.getIdToken(),
            email: user.email,
            picture: user.photoURL
        });
        navigate("/dashboard")
    }
    const logout = () => {
        setUser(null);
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