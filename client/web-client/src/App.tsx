
import './App.css'
import AuthProvider from './components/AuthProvider'
import Dashboard from './Dashboard'
import Login from './Login'
import { useState } from 'react'
import { SunMedium } from 'lucide-react'
import { BrowserRouter, Router, Routes, Route } from 'react-router'

function App() {

    const [isDark, setIsDark] = useState(true);

    const setDark = (isDark: boolean) => {
        document.body.classList.toggle('light-theme');
        setIsDark(!isDark);
    }

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path={"/dashboard"} element={<Dashboard />}></Route>
                    <Route path={"/"} element={<Dashboard />}></Route>
                    <Route path={"/login"} element={<Login />}></Route>
                </Routes>
                <SunMedium className='theme' color={"black"} onClick={() => setDark(isDark)} />
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
