import { useContext, useEffect, useInsertionEffect, useState } from "react";
import "../assets/navbar.css"
import { Bell } from "lucide-react";
import { AuthContext } from "./AuthProvider";

const Profile = () => {

    const user = useContext(AuthContext).user;
    const name = user?.name;
    const profilePicture = user?.picture;

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
                <img className="profile-picture" src={`${profilePicture}`} alt="pfp" referrerPolicy="no-referrer" />
                <div>{name}</div>
            </div>
        </div>
    )
}


export default Profile;