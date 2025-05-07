
export const uploadFile = async (file: File, userId: string, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId)


    try {
        const response = await fetch('http://localhost:3000/upload', {

            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) console.error("Post file");
        const data = await response.status;
        return data;
    } catch (error) {
        console.error('Error uploading: ', error);
    }

}



export const getUserFiles = async (token: string) => {
    try {
        console.log("Attempting to retrieved files...")
        const response = await fetch('http://localhost:3000/user-files', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user files");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
export const getSharedFiles = async (token: string) => {
    try {
        console.log("Attempting to get shared files files...")
        const response = await fetch('http://localhost:3000/get-shared', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch shared files");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};;

export const getUserFileLink = async (fileId: string, token: string) => {
    try {
        console.log("Attempting to retrieve file link...")
        const response = await fetch(`http://localhost:3000/file-link?fileId=${fileId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user files");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const shareFile = async (fileId: string, email: string, token: undefined) => {
    try {
        console.log("Attempting to share...")
        const response = await fetch(`http://localhost:3000/sharing?fileId=${fileId}&email=${email}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user files");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};
export const createAccount = async (id: string, name: string | null, email: string | null, token: string) => {
    const formData = new FormData();
    formData.append("id", id);
    if (name) {
        formData.append("name", name);
    } else {
        formData.append("name", "nullname");
    }
    if (email) {
        formData.append("email", email);
    } else {
        formData.append("email", "nullemail");
    }

    const response = await fetch('http://localhost:3000/register-user', {
        method: "POST",
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        console.error("user creation");
    }
    return await response.json();
}

export const deleteFile = async (fileId: string, token: string) => {
    try {
        console.log("Attempting to retrieve file link...")
        const response = await fetch(`http://localhost:3000/delete-file?fileId=${fileId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user files");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};