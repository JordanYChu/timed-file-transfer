import { useContext, useMemo, useState } from "react";
import "../assets/fileViewer.css";
import { Search, List, Box, Settings2, FileText } from "lucide-react";
import { AuthContext } from "./AuthProvider";
import { fallbackIcon, fileTypeMapping, fileTypes, FileMetaData } from "../fileMapping";
import "../assets/infoCard.css"
import { FileSystemContext } from "../FileSystemProvider";
import "../assets/loader.css"
import { getUserFileLink } from "../services/fileApi";


const formatDate = (iso: string) => new Date(iso).toLocaleDateString();
const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const InfoCard = ({ file }: { file: FileMetaData }) => {

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
    const files = useContext(FileSystemContext).systemInfo.files;
    const token = useContext(AuthContext).user?.token;
    if (!token) return;
    const { isLoading, error } = useContext(FileSystemContext).systemStatus;
    console.log(files)
    const [fileType, setFileType] = useState("All");
    const [search, setSearch] = useState("");
    const [showGrid, setShowGrid] = useState(true);
    const [selectedFile, setSelectedFile] = useState<number | null>(null);

    const FileCard = ({ file, index }: { file: FileMetaData, index: number }) => {
        const [url, setUrl] = useState<null | string>(null);
        getUserFileLink(file.fileId, token).then(
            (result) => {
                if (fileTypeMapping[file.fileExtension].category !== "Image") {
                    return
                }
                setUrl(result.url);
            }
        );
        const FileIcon = fileTypeMapping[file.fileExtension]?.icon || fallbackIcon;
        return (
            <div className="file-card">
                <div className="file-header">
                    <div className="fixed">
                        <FileIcon />
                    </div>
                    <div className="file-type">
                        <p>{file.name}</p>
                    </ div>
                    <div className="fixed">
                        <Settings2 onClick={() => setSelectedFile(index)} />
                    </div>
                </div>
                {url == null &&
                    <div className="file-preview">
                        <FileIcon className="file-icon" style={{ height: "100%", width: "100%" }} />
                    </div>
                }
                {url !== null &&
                    <img className="file-preview" src={`${url}`} alt="image" referrerPolicy="no-referrer" />
                }
                <div className="file-footer">
                    <span className="file-type">{file.expiration}</span>
                </div>
            </div>
        )
    }

    const filterFiles = (files: FileMetaData[]) => {

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
                {isLoading &&
                    <div className="loading-files">
                        <div className="generic-spinner"></div>
                        <div className="loader-message">Loading Files</div>
                    </div>
                }
                {error &&
                    <div className="loading-files">
                        {/* <button onClick={ }>retry</button> */}
                        <div className="loader-message">{error}</div>
                    </div>
                }
                {showGrid && !isLoading && !error && <div className="file-cards">
                    {filterFiles(files).map((file, i) => {
                        return <FileCard key={i} file={file} index={i}></FileCard>
                    })}
                </div>}
                {/* {!showGrid && <table> */}
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
                {/* </table>} */}
            </div>
            {selectedFile !== null &&
                <>
                    <div className="unfocus-screen" onClick={() => setSelectedFile(null)}></div>
                    <InfoCard file={files[selectedFile]} />
                </>
            }
        </>
    )
}



export default FileViewer;
