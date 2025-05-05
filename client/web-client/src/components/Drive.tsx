import { useContext } from "react";
import "../assets/drive.css"
import { fileTypes, fileTypeMapping } from "../fileMapping";
import { FileSystemContext } from "../FileSystemProvider";

const Drive = () => {
    const { files, usedStorage, storage } = useContext(FileSystemContext).systemInfo;

    const fileCounts = Object.fromEntries(fileTypes.map(key => [key, 0]));
    for (let file of files) {
        const category = fileTypeMapping[file.fileExtension].category;
        if (!category) continue;
        fileCounts[category]++;
    }
    return (
        <div className="drive-container">
            <div className="drive float">
                <div className="drive-wheel">
                    <div className="drive-space">
                        <div className="space">{Math.floor(usedStorage / 1024 / 1024)} MB</div>
                        <div>used</div>
                    </div>
                </div>
            </div>
            <div className="info-card-sidebar">
                {Object.entries(fileCounts).map(([type, count]) => {
                    return (
                        <div className="info-box">
                            <div>{type}</div>
                            <div>{count}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Drive;