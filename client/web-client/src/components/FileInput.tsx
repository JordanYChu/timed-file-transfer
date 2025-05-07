import { Upload } from "lucide-react";
import "../assets/inputSection.css";
import { getUserFileLink, uploadFile } from "../services/fileApi";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { FileNotification } from "./Notifications";
import { FileSystemContext } from "../FileSystemProvider";
const FileInput = ({ changeUploadStatus }: { changeUploadStatus: (id: string, notificaiton: FileNotification) => void }) => {
    const userId = useContext(AuthContext).user?.uid
    const token = useContext(AuthContext).user?.token;
    const getFiles = useContext(FileSystemContext).getFiles;
    const [url, setUrl] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: any) => {
        const files = e.target.files;
        if (!files || !userId || !token) return;
        const filesArr = Array.from(files) as File[]

        for (const file of filesArr) {
            const id = file.name;
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
        };

    }

    const inputClick = () => {
        inputRef.current?.click();
    }
    return (
        <div className="file-input float" onClick={inputClick}>
            <Upload size={48} />
            <h2 style={{ margin: "0.5rem", fontSize: "medium" }}> Drag and Drop Here</h2>
            <input ref={inputRef} style={{ display: "none" }} type="file" onChange={handleFileChange} multiple />
        </div >
    )
}

export default FileInput;