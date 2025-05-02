import { useContext } from 'react';
import { auth } from './firebase'; // adjust the path if needed
import { browserLocalPersistence, GoogleAuthProvider, setPersistence, signInWithPopup } from 'firebase/auth';
import { AuthContext } from './components/AuthProvider';
import { createAccount } from './services/fileApi';

const Login = () => {

    const { login } = useContext(AuthContext);

    const handleGoogleAuth = async (e: any) => {
        setPersistence(auth, browserLocalPersistence).then(async () => {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const id = result.user.uid;
                const name = result.user.displayName;
                const email = result.user.email;
                const token = await result.user.getIdToken();
                const userResult = await createAccount(id, name, email, token)
                if (!userResult) console.log("failed to create user", auth)
                login(result.user);
            } catch {
                console.error("google auth");
            }
        }
        )
    }

    return (
        <div>
            <h1>Login Please</h1>
            <button onClick={handleGoogleAuth}>click me</button>
        </div>
    )
}

export default Login;