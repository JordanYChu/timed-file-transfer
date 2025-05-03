import { useContext } from "react";
import "../assets/drive.css"
import { fileTypes } from "../fileMapping";
import { FileSystemContext } from "../FileSystemProvider";

const Drive = () => {
    const files = useContext(FileSystemContext);
    const usedSpace = Object.values(files).reduce((sum, file) => sum + file.fileSize, 0);
    return (
        <div className="drive-container">
            <div className="drive float">
                <div className="drive-wheel">
                    <div className="drive-space">
                        <div className="space">{usedSpace} b</div>
                        <div>used</div>
                    </div>
                </div>
            </div>
            <div className="info-card-sidebar">
                <div className="info-box">
                    <div>Files</div>
                    <div>1</div>
                </div>
                <div className="info-box">
                    <div>Images</div>
                    <div>2</div>
                </div>
                <div className="info-box">
                    <div>Videos</div>
                    <div>3</div>
                </div>
                <div className="info-box">
                    <div>Documents</div>
                    <div>5</div>
                </div>
                <div className="info-box">
                    <div>Archives</div>
                    <div>5</div>
                </div>
            </div>
        </div>
    )
}

export default Drive;