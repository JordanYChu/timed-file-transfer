

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3000/upload', {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        console.error("Post file");
    }

    return await response.json();
}