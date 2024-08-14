const uploadImage = async (images) => {
    const formData = new FormData();
    formData.append("file", images);
    formData.append("upload_preset", "lqf55wym");

    const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/image/upload`;

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Upload error:", errorData);
            alert(`Upload error: ${errorData.message}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Network error:", error);
        alert(`Network error: ${error.message}`);
    }
};


export default uploadImage 