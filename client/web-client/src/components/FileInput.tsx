import { Upload } from "lucide-react";
import "../assets/inputSection.css";
import { uploadFile } from "../services/fileApi";

const FileInput = () => {
    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = uploadFile(file);
            console.log(result);

        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="file-input float">
            <Upload size={48} />
            <h2 style={{ margin: "0.5rem", fontSize: "medium" }}> Drag and Drop Here</h2>
            <input type="file" onClick={handleFileChange} />
        </div >
    )
}

export default FileInput;