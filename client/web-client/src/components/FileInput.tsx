import { Upload } from "lucide-react";
import "../assets/inputSection.css";
import { uploadFile } from "../services/fileApi";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { FileNotification } from "./Notifications";
import { FileSystemContext } from "../FileSystemProvider";
const FileInput = ({ changeUploadStatus }: { changeUploadStatus: (id: string, notificaiton: FileNotification) => void }) => {
    const userId = useContext(AuthContext).user?.uid
    const token = useContext(AuthContext).user?.token;
    const getFiles = useContext(FileSystemContext).getFiles;

    const handleFileChange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file || !userId || !token) return;

        const id = file.name + Math.floor(Math.random() * 123);
        const notification: FileNotification = { fileName: file.name, message: "uploading...", fileStatus: 0 }
        changeUploadStatus(id, notification);
        const result = await uploadFile(file, userId, token);
        // Successful upload
        if (result && result >= 200 && result < 300) {
            const newNotification: FileNotification = { fileName: file.name, message: "Finished...", fileStatus: 2 }
            changeUploadStatus(id, newNotification);
            getFiles();
        } else { // unsucsessful upload
            const newNotification: FileNotification = { fileName: file.name, message: "Error Uploading...", fileStatus: 1 }
            changeUploadStatus(id, newNotification);
        }

    }
    return (
        <div className="file-input float">
            <Upload size={48} />
            <h2 style={{ margin: "0.5rem", fontSize: "medium" }}> Drag and Drop Here</h2>
            <input type="file" onChange={handleFileChange} />
        </div >
    )
}

export default FileInput;