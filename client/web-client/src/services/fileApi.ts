
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