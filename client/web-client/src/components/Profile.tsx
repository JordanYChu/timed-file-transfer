import { useContext, useEffect, useState } from "react";
import "../assets/navbar.css"
import { Bell, LogOutIcon } from "lucide-react";
import { AuthContext } from "./AuthProvider";

const Profile = () => {

    const user = useContext(AuthContext).user;
    const { logout } = useContext(AuthContext);
    const name = user?.name;
    const profilePicture = user?.picture;

    const [profileDropDown, setProfileDropDown] = useState(false);
    const [time, setTime] = useState<Date>(new Date());
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTime(new Date());
        }, 1000)

        return () => clearInterval(timeInterval);
    }, [])
    return (
        <div className="profile-container">
            <div className="box">
                <button className="notification-button">
                    <div>Notifications</div>
                    <Bell />
                </button>
            </div>
            <div className="box">
                <div className="time-container">{time.toLocaleTimeString()}</div>
            </div>
            <div className="box">
                <img onClick={() => setProfileDropDown(!profileDropDown)} className="profile-picture" src={`${profilePicture}`} alt="pfp" referrerPolicy="no-referrer" />
                <div>{name}</div>
                {profileDropDown &&
                    <div className="dropdown">
                        <button onClick={() => logout()}>Logout <LogOutIcon size={16} /></button>
                    </div>}
            </div>
        </div>
    )
}


export default Profile;