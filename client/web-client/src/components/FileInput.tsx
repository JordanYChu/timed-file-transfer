import { Upload } from "lucide-react";
import "../assets/inputSection.css";

const FileInput = () => {
    return (
        <div className="file-input float">
            <Upload size={48} />
            <h2 style={{ margin: "0.5rem", fontSize: "medium" }}> Drag and Drop Here</h2>
        </div >
    )
}

export default FileInput;