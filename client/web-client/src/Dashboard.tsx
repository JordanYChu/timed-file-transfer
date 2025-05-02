
import Profile from './components/Profile'
import FileInput from './components/FileInput'
import FileViewer from './components/FileViewer'
import Notifications from './components/Notifications'
import Drive from './components/Drive'
import { AuthContext } from './components/AuthProvider'
import { useContext } from 'react'
import { Navigate } from 'react-router'
const Dashboard = () => {

    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/" replace />;

    return (
        <>
            <Profile />
            <div className='main-body'>
                <Notifications />
                <div className='file-section'>
                    <FileInput />
                    <FileViewer />
                </div>
                <Drive />
            </div>
        </>
    )
}

export default Dashboard;