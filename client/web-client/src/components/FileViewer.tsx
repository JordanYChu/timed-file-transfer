import { useContext, useState } from "react";
import "../assets/fileViewer.css";
import { Search, List, Box, Settings2, FileText } from "lucide-react";
import { AuthContext } from "./AuthProvider";
import { fallbackIcon, fileTypeMapping, fileTypes } from "../fileMapping";
import "../assets/infoCard.css"


type FileMetaDeta = {
    fileId: string;
    fileSize: number;
    name: string,
    creation: string,
    expiration: string,
    fileExtension: string,
}

const filesMetaData: FileMetaDeta[] = [
    {
        fileId: "12345abcde",
        fileSize: 1048576, // 1 MB in bytes
        name: "file1",
        creation: "2025-05-02T12:00:00Z",
        expiration: "2025-06-02T12:00:00Z",
        fileExtension: ".txt"
    },
    {
        fileId: "67890fghij",
        fileSize: 2048000, // 2 MB in bytes
        name: "file2",
        creation: "2025-04-15T09:30:00Z",
        expiration: "2025-05-15T09:30:00Z",
        fileExtension: ".pdf"
    },
    {
        fileId: "11223klmno",
        fileSize: 5242880, // 5 MB in bytes
        name: "file3",
        creation: "2025-03-22T10:45:00Z",
        expiration: "2025-04-22T10:45:00Z",
        fileExtension: ".jpg"
    },
    {
        fileId: "44556pqrst",
        fileSize: 10485760, // 10 MB in bytes
        name: "file4",
        creation: "2025-02-18T15:20:00Z",
        expiration: "2025-03-18T15:20:00Z",
        fileExtension: ".mp4"
    },
    {
        fileId: "78901uvwxy",
        fileSize: 2097152, // 2 MB in bytes
        name: "file5",
        creation: "2025-04-10T08:00:00Z",
        expiration: "2025-05-10T08:00:00Z",
        fileExtension: ".docx"
    },
    {
        fileId: "22334zabcd",
        fileSize: 5120000, // 5 MB in bytes
        name: "file6",
        creation: "2025-03-14T13:15:00Z",
        expiration: "2025-04-14T13:15:00Z",
        fileExtension: ".png"
    },
    {
        fileId: "55667efghi",
        fileSize: 10485760, // 10 MB in bytes
        name: "file7",
        creation: "2025-02-20T11:10:00Z",
        expiration: "2025-03-20T11:10:00Z",
        fileExtension: ".zip"
    },
    {
        fileId: "88990jklmn",
        fileSize: 8192000, // 8 MB in bytes
        name: "file8",
        creation: "2025-01-30T16:25:00Z",
        expiration: "2025-02-28T16:25:00Z",
        fileExtension: ".xlsx"
    },
    {
        fileId: "33445opqrs",
        fileSize: 3276800, // 3 MB in bytes
        name: "file9",
        creation: "2025-04-01T12:00:00Z",
        expiration: "2025-05-01T12:00:00Z",
        fileExtension: ".csv"
    },
    {
        fileId: "66778wxyz0",
        fileSize: 4194304, // 4 MB in bytes
        name: "file10",
        creation: "2025-03-25T14:45:00Z",
        expiration: "2025-04-25T14:45:00Z",
        fileExtension: ".mp3"
    },
    {
        fileId: "10112abcde",
        fileSize: 2560000, // 2.5 MB in bytes
        name: "file11",
        creation: "2025-05-01T09:00:00Z",
        expiration: "2025-06-01T09:00:00Z",
        fileExtension: ".txt"
    },
    {
        fileId: "11234fghij",
        fileSize: 5120000, // 5 MB in bytes
        name: "file12",
        creation: "2025-04-05T11:30:00Z",
        expiration: "2025-05-05T11:30:00Z",
        fileExtension: ".pdf"
    },
    {
        fileId: "22345klmno",
        fileSize: 10240000, // 10 MB in bytes
        name: "file13",
        creation: "2025-03-08T13:40:00Z",
        expiration: "2025-04-08T13:40:00Z",
        fileExtension: ".jpg"
    },
    {
        fileId: "33456pqrst",
        fileSize: 2048000, // 2 MB in bytes
        name: "file14",
        creation: "2025-02-28T14:30:00Z",
        expiration: "2025-03-28T14:30:00Z",
        fileExtension: ".mp4"
    },
    {
        fileId: "44567uvwxy",
        fileSize: 2097152, // 2 MB in bytes
        name: "file15",
        creation: "2025-01-10T12:00:00Z",
        expiration: "2025-02-10T12:00:00Z",
        fileExtension: ".docx"
    },
    {
        fileId: "55678zabcd",
        fileSize: 8192000, // 8 MB in bytes
        name: "file16",
        creation: "2025-04-15T15:30:00Z",
        expiration: "2025-05-15T15:30:00Z",
        fileExtension: ".png"
    },
    {
        fileId: "66789efghi",
        fileSize: 4096000, // 4 MB in bytes
        name: "file17",
        creation: "2025-03-12T09:20:00Z",
        expiration: "2025-04-12T09:20:00Z",
        fileExtension: ".zip"
    },
    {
        fileId: "77890jklmn",
        fileSize: 3276800, // 3 MB in bytes
        name: "file18",
        creation: "2025-02-23T10:10:00Z",
        expiration: "2025-03-23T10:10:00Z",
        fileExtension: ".xlsx"
    },
    {
        fileId: "88901opqrs",
        fileSize: 5242880, // 5 MB in bytes
        name: "file19",
        creation: "2025-01-22T11:10:00Z",
        expiration: "2025-02-22T11:10:00Z",
        fileExtension: ".csv"
    },
    {
        fileId: "99012wxyz0",
        fileSize: 10485760, // 10 MB in bytes
        name: "file20",
        creation: "2025-04-20T08:55:00Z",
        expiration: "2025-05-20T08:55:00Z",
        fileExtension: ".mp3"
    },
    {
        fileId: "99012wxyz0",
        fileSize: 10485760, // 10 MB in bytes
        name: "file20",
        creation: "2025-04-20T08:55:00Z",
        expiration: "2025-05-20T08:55:00Z",
        fileExtension: ".tsx"
    }
];

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
