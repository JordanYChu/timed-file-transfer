import { CircleX } from "lucide-react";
import "../assets/notifications.css"

type Notification = {
    fileName: string,
    message: string,
    fileStatus: number;
}
const Notifications = () => {

    const notifications: Notification[] = [
        { fileName: "Malcom", message: "Uploading...", fileStatus: 0 },
        { fileName: "in", message: "Success...", fileStatus: 2 },
        { fileName: "the", message: "Failed...", fileStatus: 1 },
        { fileName: "middle", message: "Uploading...", fileStatus: 0 },
    ]

    return (
        <div className="notifications">
            {notifications.map((notification, i) => {
                return (
                    <div className={`notification ${getClassStatus(notification.fileStatus)}`}>
                        <div className="file-header">
                            <div className="file">{notification.fileName}</div>
                            <CircleX size={20} />
                        </div>
                        <div className="file-header file-status">{notification.message}</div>
                    </div>
                )
            })}
        </div>
    )
}


const getClassStatus = (fileStatus: number) => {
    return ""
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