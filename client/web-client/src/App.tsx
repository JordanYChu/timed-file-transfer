
import './App.css'
import Profile from './components/Profile'
import FileInput from './components/FileInput'
import FileViewer from './components/FileViewer'
import Notifications from './components/Notifications'
import Drive from './components/Drive'
import { useState } from 'react'
import { SunMedium } from 'lucide-react'


function App() {

    const [isDark, setIsDark] = useState(true);

    const setDark = (isDark: boolean) => {
        document.body.classList.toggle('light-theme');
        setIsDark(!isDark);
    }

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
            <SunMedium className='theme' color={"black"} onClick={() => setDark(isDark)} />
        </>

    )
}

export default App
