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
                <h1 className='title'>Timed File Transfer</h1>
                <p>
                    This app helps you manage temporary files by automatically deleting them after a period of time.
                </p>
                <p>
                    You can upload or transfer files and assign a lifespan to each. Once their time is up, they'll be removed saving space and reducing clutter.
                </p>
                <ul>
                    <li>Prevent storage overflow</li>
                    <li>Automate cleanup of old files</li>
                    <li>Time-controlled transfers</li>
                </ul>
                <p>
                    "Keep only what matters. Let the rest go — automatically."
                </p>
            </div>
            <div className='login-section'>
                <h1><strong>Login</strong></h1>
                <span style={{ fontSize: "small" }}>Use google to access your account</span>
                <hr style={{ margin: "1rem 0", border: "none", borderTop: "2px solid var(--primary)" }} />
                <button className="signup" onClick={handleGoogleAuth}>Login with Google</button>
            </div>
        </div>
    )
}

export default Login;