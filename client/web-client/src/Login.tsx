import { useContext } from 'react';
import { auth } from './firebase'; // adjust the path if needed
import { browserLocalPersistence, GoogleAuthProvider, setPersistence, signInWithPopup } from 'firebase/auth';
import { AuthContext } from './components/AuthProvider';

const Login = () => {

    const { login } = useContext(AuthContext);

    const handleGoogleAuth = async (e: any) => {
        setPersistence(auth, browserLocalPersistence).then(async () => {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
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