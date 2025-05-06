import { useContext } from 'react';
import { auth } from './firebase'; // adjust the path if needed
import { browserLocalPersistence, getAdditionalUserInfo, GoogleAuthProvider, setPersistence, signInWithPopup } from 'firebase/auth';
import { AuthContext } from './components/AuthProvider';
import { createAccount } from './services/fileApi';
import "./assets/login.css"

const Login = () => {

    const { login } = useContext(AuthContext);

    const handleGoogleAuth = async (e: any) => {
        setPersistence(auth, browserLocalPersistence).then(async () => {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const additionalUserInfo = getAdditionalUserInfo(result);
                const isNewUser = additionalUserInfo?.isNewUser;
                if (isNewUser) {
                    const id = result.user.uid;
                    const name = result.user.displayName;
                    const email = result.user.email;
                    const token = await result.user.getIdToken();
                    const userResult = await createAccount(id, name, email, token)
                    if (!userResult) console.log("failed to create user", auth)
                    console.log("Created new user")
                }
                login(result.user);
            } catch {
                console.error("google auth");
            }
        }
        )
    }

    return (
        <div className='login-screen'>
            <div className='intro-section'>

            </div>
            <div>
                <h1>Create an Account or Login</h1>
                <button onClick={handleGoogleAuth}>click me</button>
            </div>
        </div>
    )
}

export default Login;