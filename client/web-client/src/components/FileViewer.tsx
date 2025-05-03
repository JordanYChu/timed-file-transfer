import { useContext, useState } from "react";
import "../assets/fileViewer.css";
import { Search, List, Box, Settings2, FileText } from "lucide-react";
import { AuthContext } from "./AuthProvider";
import { fallbackIcon, fileTypeMapping, fileTypes, FileMetaDeta } from "../fileMapping";
import "../assets/infoCard.css"
import { FileSystemContext } from "../FileSystemProvider";



const formatDate = (iso: string) => new Date(iso).toLocaleDateString();
const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const InfoCard = ({ file }: { file: FileMetaDeta }) => {

    return (
        <div className="info-card">
            <div className="info-header">
                <span className="info-title">{file.name}</span>
            </div>
            <div className="info-section">
                <div className="info-box">
                    <div>ID</div>
                    <div>{file.fileId}</div>
                </div>
                <div className="info-box">
                    <div>Type</div>
                    <div>{file.fileExtension}</div>
                </div>
                <div className="info-box">
                    <div>Size</div>
                    <div>{formatSize(file.fileSize)}</div>
                </div>
                <div className="info-box">
                    <div>Created</div>
                    <div>{formatDate(file.creation)}</div>
                </div>
                <div className="info-box">
                    <div>Expires</div>
                    <div>
                        {formatDate(file.expiration)}
                    </div>
                </div>
            </div>
            <div className="preview-section">
                <div className="preview-content">[ Add live preview here ]</div>
            </div>
        </div>
    );
}

const FileViewer = () => {
    const filesMetaData = useContext(FileSystemContext)
    console.log(filesMetaData)
    const [fileType, setFileType] = useState("All");
    const [search, setSearch] = useState("");
    const [showGrid, setShowGrid] = useState(true);
    const [selectedFile, setSelectedFile] = useState<number | null>(null);

    const FileCard = ({ file, index }: { file: FileMetaDeta, index: number }) => {
        const FileIcon = fileTypeMapping[file.fileExtension]?.icon || fallbackIcon;
        return (
            <div className="file-card">
                <div className="file-header">
                    <FileIcon />
                    <span className="file-type">{file.name}</span>
                    <Settings2 onClick={() => setSelectedFile(index)} />
                </div>
                <div className="file-preview">
                    <FileIcon className="file-icon" style={{ height: "100%", width: "100%" }} />
                </div>
                {/* <img className="file-preview" src={`${image}`} alt="image" referrerPolicy="no-referrer" /> */}
                <div className="file-footer">
                    <span className="file-type">{file.expiration}</span>
                </div>
            </div>
        )
    }

    const filterFiles = (files: FileMetaDeta[]) => {

        if (fileType === "All") return files.filter(file => file.name.includes(search))

        const filteredTypes = files.filter(file => {
            const mappedFile = fileTypeMapping[file.fileExtension];
            if (mappedFile) return mappedFile.category == fileType;
            return false;
        });
        if (!search || search === "") {
            return filteredTypes;
        }
        return filteredTypes.filter(file => file.name.includes(search))

    }

    const handleFileTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFileType(e.target.value);
    }
    return (
        <>
            <div className="viewer">
                <div className="search-container">
                    <div className="search-box">
                        <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
                        <Search />
                    </div>
                    <select value={fileType} aria-label="file type select" name="file-types" id="file-types" onChange={handleFileTypeChange}>
                        <option value="All">All</option>
                        {fileTypes.map((fileType, i) => <option key={i} value={fileType}>{fileType}</option>)}
                    </select>
                    <button>Recent</button>
                    {showGrid ? <List className="show-type" onClick={() => setShowGrid(!showGrid)} /> :
                        <Box className="show-type" onClick={() => setShowGrid(!showGrid)} />}
                </div>
                {showGrid && <div className="file-cards">
                    {filterFiles(filesMetaData).map((file, i) => {
                        return <FileCard key={i} file={file} index={i}></FileCard>
                    })}
                </div>}
                {!showGrid && <table>
                    {/* <tbody>
                        <tr>
                            <td>File Name</td>
                            <td>Type</td>
                            <td>Removed</td>
                        </tr>
                        {files.map((file, i) => {
                            return (
                                <tr>
                                    <td>{file}</td>
                                    <td>txt</td>
                                    <td>2025</td>
                                </tr>
                            )
                        })}
                    </tbody> */}
                </table>}
            </div>
            {selectedFile !== null &&
                <>
                    <div className="unfocus-screen" onClick={() => setSelectedFile(null)}></div>
                    <InfoCard file={filesMetaData[selectedFile]} />
                </>
            }
        </>
    )
}



export default FileViewer;
