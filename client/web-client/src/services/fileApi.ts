
export const uploadFile = async (file: File, userId: string, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId)

    const response = await fetch('http://localhost:3000/upload', {
        // mode: 'no-cors',
        method: "POST",
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        console.error("Post file");
    }

    return await response.json();
}


export const getUserFiles = async (token: string) => {
    const response = await fetch('http://localhost:3000/user-files', {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        console.error("Failed to fetch user files");
        throw new Error("Failed to fetch user files");
    }
    return await response.json();
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