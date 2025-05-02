

export const uploadFile = async (file: File, userId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId)

    const response = await fetch('http://localhost:3000/upload', {
        mode: 'no-cors',
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        console.error("Post file");
    }

    return await response.json();
}