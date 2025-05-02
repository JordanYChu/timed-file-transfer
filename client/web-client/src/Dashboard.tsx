
import Profile from './components/Profile'
import FileInput from './components/FileInput'
import FileViewer from './components/FileViewer'
import Notifications from './components/Notifications'
import Drive from './components/Drive'

const Dashboard = () => {
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