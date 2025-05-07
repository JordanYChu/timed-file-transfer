
import Profile from './components/Profile'
import FileInput from './components/FileInput'
import FileViewer from './components/FileViewer'
import Notifications from './components/Notifications'
import Drive from './components/Drive'
import { AuthContext } from './components/AuthProvider'
import { use, useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { auth } from "./firebase"
import { onAuthStateChanged } from 'firebase/auth'
import FileSystemProvider from './FileSystemProvider'
import { FileNotification } from './components/Notifications'
import { getUserFiles } from './services/fileApi'
const Dashboard = () => {

    const [loading, setLoading] = useState(true);
    const { login } = useContext(AuthContext);

    const [notifications, setNotifications] = useState<{ [key: string]: FileNotification }>({});

    const changeNotification = (id: string, notification: FileNotification) => {
        setNotifications((prev) => ({ ...prev, [id]: notification }));

        console.log("Updated notifications")
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) login(user);
            setLoading(false);
        })
    }, [auth])

    if (loading) return <div>Loading...</div>

    return (
        <>
            <Profile />
            <FileSystemProvider>
                <div className='main-body'>
                    <Notifications notifications={notifications} setNotifications={setNotifications} />
                    <div className='file-section'>
                        <FileInput changeUploadStatus={changeNotification} />
                        <FileViewer />
                    </div>
                    <Drive />
                </div>
            </FileSystemProvider>
        </>
    )
}

export default Dashboard;