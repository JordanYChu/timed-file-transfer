import { createContext, useContext, useEffect, useState } from "react";
import { FileMetaData } from "./fileMapping";
import { AuthContext } from "./components/AuthProvider";
import { getSharedFiles, getUserFiles } from "./services/fileApi";
import { renderToReadableStream } from "react-dom/server";

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

const filesMeataData: FileMetaData[] = [
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
        const userResult = await getUserFiles(token) as { [key: number]: jsonFileData };
        if (!userResult) {
            return
        }
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
            storage: 100,
            usedStorage: usedStorage
        });
        setSystemStatus({
            isLoading: false,
            error: null
        })
    }

    useEffect(() => {
        getData()
        // setTimeout(() => {
        //     setSystemInfo({
        //         files: filesMeataData,
        //         storage: 100,
        //         usedStorage: 10
        //     });
        //     setSystemStatus({
        //         isLoading: false,
        //         error: null
        //     })
        // }, 2500)
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