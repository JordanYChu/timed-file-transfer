import { createContext, useContext, useEffect, useState } from "react";
import { FileMetaData } from "./fileMapping";
import { AuthContext } from "./components/AuthProvider";
import { getSharedFiles, getUserFiles } from "./services/fileApi";

type FileSystemInfo = {
    files: FileMetaData[],
    storage: number,
    usedStorage: number
}

type FileSystemStatus = {
    isLoading: boolean,
    error: string | null
}
type FileSystemHandler = {
    systemInfo: FileSystemInfo,
    systemStatus: FileSystemStatus
    getFiles: () => void;
}

export const FileSystemContext = createContext<FileSystemHandler>({
    systemInfo: {
        files: [],
        storage: 0,
        usedStorage: 0
    },
    systemStatus: {
        isLoading: true,
        error: null
    },
    getFiles: () => { }
});

type jsonFileData = {
    createdAt: string;
    expiresAt: string;
    fileSize: string;
    id: string;
    filename: string;
    recieverId: string;
    status: string;
};

const FileSystemProvider = ({ children }: any) => {
    const [systemInfo, setSystemInfo] = useState<FileSystemInfo>({ files: [], storage: 0, usedStorage: 0 });
    const [systemStatus, setSystemStatus] = useState<FileSystemStatus>({ error: null, isLoading: true });
    const token = useContext(AuthContext).user?.token;
    const userId = useContext(AuthContext).user?.uid;

    const getData = async () => {
        if (!token) return;
        setSystemStatus({ error: null, isLoading: true });

        // Get user files
        const userResult = await getUserFiles(token) as { [key: number | string]: jsonFileData };
        if (!userResult) {
            return
        }

        const maxStorage = Number(userResult["totalStorage"]);
        delete userResult["totalStorage"];

        const retrievedUserFiles = Object.values(userResult).map(file => {
            return {
                fileId: file.id,
                fileSize: Number(file.fileSize),
                creation: file.createdAt,
                expiration: file.expiresAt,
                ownderId: userId,
                name: file.filename,
                fileExtension: getFileExtension(file.filename)
            } as FileMetaData
        })

        // get shared files
        const sharedResult = await getSharedFiles(token) as { [key: number]: jsonFileData };
        if (!sharedResult) {
            return
        }
        const retrievedSharedFiles = Object.values(sharedResult).map(file => {
            return {
                fileId: file.id,
                fileSize: Number(file.fileSize),
                creation: file.createdAt,
                expiration: file.expiresAt,
                ownderId: "not user",
                name: file.filename,
                fileExtension: getFileExtension(file.filename)
            } as FileMetaData
        })

        const usedStorage = Object.values(retrievedUserFiles).reduce((sum, file) => sum + file.fileSize, 0);
        retrievedUserFiles.push(...retrievedSharedFiles)
        setSystemInfo({
            files: retrievedUserFiles,
            storage: maxStorage,
            usedStorage: usedStorage
        });
        setSystemStatus({
            isLoading: false,
            error: null
        })
    }

    useEffect(() => {
        getData()
    }, [])

    const values = {
        systemInfo: systemInfo,
        systemStatus: systemStatus,
        getFiles: getData
    }

    return (
        <FileSystemContext.Provider value={values}>
            {children}
        </FileSystemContext.Provider>
    )
}

const getFileExtension = (filename: string) => {
    const cleanName = filename.split(/[?#]/)[0];
    const lastDotIndex = cleanName.lastIndexOf(".");

    if (lastDotIndex === -1 || lastDotIndex === 0) return "";

    return cleanName.slice(lastDotIndex, cleanName.length);
}

export default FileSystemProvider;