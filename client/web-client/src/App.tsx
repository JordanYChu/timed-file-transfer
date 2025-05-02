
import './App.css'
import AuthProvider from './components/AuthProvider'
import Dashboard from './Dashboard'
import Login from './login'
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
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={"/dashboard"} element={<Dashboard />}></Route>
                    <Route path={"/"} element={<Login />}></Route>
                </Routes>
            </BrowserRouter>
            <SunMedium className='theme' color={"black"} onClick={() => setDark(isDark)} />
        </AuthProvider>
    )
}

export default App
