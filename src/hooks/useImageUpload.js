import { useState } from 'react';
import axios from 'axios';

const useImageUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadImage = async (file) => {
        if (!file) return null;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
                formData
            );

            if (response.data.success) {
                return response.data.data.display_url;
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.error('Image upload error:', err);
            setError('Failed to upload image. Please try again.');
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading, error };
};

export default useImageUpload;
