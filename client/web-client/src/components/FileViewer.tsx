import { useState } from "react";
import "../assets/fileViewer.css";
import { Search, List, Box, Settings2, FileText } from "lucide-react";

const fileTypes = [
    "txt",
    "pdf",
    "pptx",
    "docx",
    "png",
    "jpg",
    "webpg",
]

const FileViewer = () => {
    const [fileType, setFileType] = useState(".txt");
    const [search, setSearch] = useState("");
    const [showGrid, setShowGrid] = useState(true);
    const [selectedFile, setSelectedFile] = useState<number | null>(null);

    const files = [
        "File 1",
        "File 2",
        "File 3",
        "File 4",
        "File 5",
        "File 6",
        "File 7",
        "File 8",
        "File 9",
        "File 1",
        "File 2",
        "File 3",
        "File 4",
        "File 5",
        "File 6",
        "File 7",
        "File 8",
        "File 9",
        "File 1",
        "File 2",
        "File 3",
        "File 4",
        "File 5",
        "File 6",
        "File 7",
        "File 8",
        "File 9",
    ]

    const FileCard = ({ name, index }: { name: string, index: number }) => {
        return (
            <div className="file-card">
                <div className="file-header">
                    <FileText />
                    <span className="file-type">{name}</span>
                    <Settings2 onClick={() => setSelectedFile(index)} />
                </div>
                <img src="" alt="" />
                <div className="file-footer">
                    <span className="file-type">time</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="viewer">
                <div className="search-container">
                    <div className="search-box">
                        <input type="text" placeholder="Search..." />
                        <Search />
                    </div>
                    <select aria-label="file type select" name="file-types" id="file-types">
                        <option value="all">all</option>
                        {fileTypes.map(fileType => <option value={fileType}>{fileType}</option>)}
                    </select>
                    <button>Recent</button>
                    {showGrid ? <List className="show-type" onClick={() => setShowGrid(!showGrid)} /> :
                        <Box className="show-type" onClick={() => setShowGrid(!showGrid)} />}
                </div>
                {showGrid && <div className="file-cards">
                    {files.map((file, i) => {
                        return <FileCard key={i} name={file} index={i}></FileCard>
                    })}
                </div>}
                {!showGrid && <table>
                    <tbody>
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
                    </tbody>
                </table>}
            </div>
            {selectedFile &&
                <>
                    <div className="unfocus-screen" onClick={() => setSelectedFile(null)}></div>
                    <div className="info-card">{selectedFile}</div>
                </>
            }
        </>
    )
}



export default FileViewer;
