import { CircleX } from "lucide-react";
import "../assets/notifications.css"

export type FileNotification = {
    fileName: string,
    message: string,
    fileStatus: number;
}

const removeKey = (key: any, { [key]: _, ...rest }) => rest;


const Notifications = ({ notifications, setNotifications }: { notifications: { [key: string]: FileNotification }, setNotifications: any }) => {

    return (
        <div className="notifications">
            {Object.keys(notifications).map((id, i) => {
                const notification = notifications[id];
                return (
                    <div key={i} className={`notification ${getClassStatus(notification.fileStatus)}`}>
                        <div className="file-header">
                            <div className="file">{notification.fileName}</div>

                            <CircleX onClick={() => {
                                console.log(notification)
                                setNotifications(removeKey(notification.fileName, notifications));
                            }} size={20} />
                        </div>
                        <div className="file-header file-status">{notification.message}</div>
                    </div>
                )
            })}
        </div>
    )
}


const getClassStatus = (fileStatus: number) => {
    // return ""
    switch (fileStatus) {
        case 1: {
            return "error";
        }
        case 2: {
            return "success";
        }
        default: {
            return "uploading";
        }
    }
}

export default Notifications;