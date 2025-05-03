import {
    FileText,
    FileImage,
    FileVideo,
    FileAudio,
    FileArchive,
    FileCode,
    FileSpreadsheet,
    FileType2,
} from "lucide-react";

export const fileTypeMapping: Record<string, { icon: React.ElementType; category: string }> = {
    ".jpg": { icon: FileImage, category: "Image" },
    ".jpeg": { icon: FileImage, category: "Image" },
    ".png": { icon: FileImage, category: "Image" },
    ".gif": { icon: FileImage, category: "Image" },
    ".bmp": { icon: FileImage, category: "Image" },
    ".svg": { icon: FileImage, category: "Image" },
    ".webp": { icon: FileImage, category: "Image" },

    ".mp4": { icon: FileVideo, category: "Video" },
    ".mov": { icon: FileVideo, category: "Video" },
    ".avi": { icon: FileVideo, category: "Video" },
    ".mkv": { icon: FileVideo, category: "Video" },
    ".flv": { icon: FileVideo, category: "Video" },

    ".mp3": { icon: FileAudio, category: "Audio" },
    ".wav": { icon: FileAudio, category: "Audio" },
    ".aac": { icon: FileAudio, category: "Audio" },
    ".ogg": { icon: FileAudio, category: "Audio" },

    ".zip": { icon: FileArchive, category: "Archive" },
    ".rar": { icon: FileArchive, category: "Archive" },
    ".tar": { icon: FileArchive, category: "Archive" },
    ".7z": { icon: FileArchive, category: "Archive" },

    ".txt": { icon: FileText, category: "Document" },
    ".md": { icon: FileText, category: "Document" },
    ".doc": { icon: FileText, category: "Document" },
    ".docx": { icon: FileText, category: "Document" },
    ".pdf": { icon: FileText, category: "Document" },

    ".xls": { icon: FileSpreadsheet, category: "Document" },
    ".xlsx": { icon: FileSpreadsheet, category: "Document" },

    ".js": { icon: FileCode, category: "Code" },
    ".ts": { icon: FileCode, category: "Code" },
    ".jsx": { icon: FileCode, category: "Code" },
    ".tsx": { icon: FileCode, category: "Code" },
    ".py": { icon: FileCode, category: "Code" },
    ".java": { icon: FileCode, category: "Code" },
    ".cpp": { icon: FileCode, category: "Code" },
    ".c": { icon: FileCode, category: "Code" },
};

export const fileTypes = [
    "Image", "Audio", "Video", "Archive", "Document", "Code"
]

export const fallbackIcon = FileType2;

export type FileMetaDeta = {
    fileId: string;
    fileSize: number;
    name: string,
    creation: string,
    expiration: string,
    fileExtension: string,
}