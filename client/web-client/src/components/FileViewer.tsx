import { useContext, useMemo, useState } from "react";
import "../assets/fileViewer.css";
import { Search, List, Box, Settings2, FileText } from "lucide-react";
import { AuthContext } from "./AuthProvider";
import { fallbackIcon, fileTypeMapping, fileTypes, FileMetaData } from "../fileMapping";
import "../assets/infoCard.css"
import { FileSystemContext } from "../FileSystemProvider";
import "../assets/loader.css"
import { getUserFileLink } from "../services/fileApi";
import React from "react";


const formatDate = (iso: string) => new Date(iso).toLocaleDateString();
const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const getRemainingTime = (date: string) => {
    const time1 = new Date(date);
    const time2 = new Date(); // Example earlier time
    if (!time1 || !time2) return 0;

    const diffMs = Math.abs(time1 - time2); // Difference in milliseconds

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const diffSeconds = Math.floor((diffMs / 1000) % 60);

    if (diffDays !== 0) return `${diffDays} day(s)`
    if (diffHours !== 0) return `${diffHours} hour(s)`
    if (diffMinutes !== 0) return `${diffMinutes} minute(s)`
    if (diffSeconds !== 0) return `${diffSeconds} second(s)`
}

const InfoCard = ({ file, preview }: { file: FileMetaData, preview: string | null }) => {

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
                <div className="preview-content">
                    <img src={`${preview}`} alt="" />
                </div>
            </div>
            <div>
                <button
                    className="download-button"
                    onClick={async () => {
                        if (!preview) return;
                        const response = await fetch(preview);
                        const blob = await response.blob();
                        const url = URL.createObjectURL(blob);

                        const a = document.createElement('a');
                        a.href = url;
                        a.download = file.name;
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                >
                    Download
                </button>
            </div>
        </div>
    );
}
const FileCard = React.memo(({ file }: { file: FileMetaData }) => {
    const token = useContext(AuthContext).user?.token;
    if (!token) return;
    const [url, setUrl] = useState<null | string>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [selected, setSelected] = useState(false);
    if (url == null) {
        getUserFileLink(file.fileId, token).then(
            (result) => {
                if (!result) return;
                setUrl(result.url);
                if (fileTypeMapping[file.fileExtension]?.category === "Image") {
                    setShowPreview(true)
                }
            }
        );
    }
    const FileIcon = fileTypeMapping[file.fileExtension]?.icon || fallbackIcon;
    return (
        <div className={`file-card`}>
            <div className="file-header">
                <div className="fixed"> <FileIcon /> </div>
                <div className="file-type"> <p>{file.name}</p> </ div>
                <div className="fixed"> <Settings2 onClick={() => setSelected(true)} /> </div>
            </div>
            {!showPreview &&
                <div className="file-preview ">
                    <FileIcon className="file-icon" style={{ height: "100%", width: "100%" }} />
                </div>
            }
            {
                showPreview &&
                <img className="file-preview file-preview-image" src={`${url}`} alt="image" referrerPolicy="no-referrer" />
            }
            <div className="file-footer">
                <span className="file-type">{getRemainingTime(file.expiration)}</span>
            </div>
            {selected &&
                <>
                    <div className="unfocus-screen" onClick={() => setSelected(false)}></div>
                    <InfoCard file={file} preview={url} />
                </>
            }
        </div >
    )
}, (prevProps, nextProps) => {
    console.log(nextProps.file.fileId === prevProps.file.fileId);
    return nextProps.file.fileId === prevProps.file.fileId;
})

const FileViewer = () => {
    const files = useContext(FileSystemContext).systemInfo.files;
    const { isLoading, error } = useContext(FileSystemContext).systemStatus;
    const [fileType, setFileType] = useState("All");
    const [search, setSearch] = useState("");
    const [showGrid, setShowGrid] = useState(true);

    const filterFiles = (files: FileMetaData[]) => {

        const result: Record<string, boolean> = {};

        for (const file of files) {
            const matchesSearch = file.name.includes(search);
            const matchesType = fileType === "All" || (
                fileTypeMapping[file.fileExtension]?.category === fileType
            );

            result[file.fileId] = matchesSearch && matchesType;
        }

        return result;
    }

    const shownFiles = useMemo(() => { return filterFiles(files) }, [search, fileType, isLoading])

    const handleFileTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFileType(e.target.value);
    }
    const fileCards = useMemo(() => {
        console.log(files, showGrid, isLoading, error, search, fileType);
        if (showGrid && !isLoading && !error) {
            return (
                <div className="file-cards">
                    {files.map((file, i) => (
                        <div key={file.fileId} className={`${shownFiles[file.fileId] ? "shown" : "not-shown"}`}>
                            <FileCard key={file.fileId} file={file} />
                        </div>
                    ))
                    }
                </div >
            );
        }
        return null;
    }, [files, showGrid, isLoading, error, search, fileType])

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
                {fileCards}
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

        </>
    )
}



export default FileViewer;
