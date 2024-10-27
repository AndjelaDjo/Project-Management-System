import { useState } from 'react';
import axiosInstance from '../../utilis/axiosInstance';

const FileUpload = ({ projectId, onFileUploaded }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post(`/projects/${projectId}/upload-file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const uploadedFile = response.data.file;
            const fileData = {
                fileName: uploadedFile.fileName,
                filePath: uploadedFile.filePath
            };

            onFileUploaded(fileData);
        } catch (error) {
            console.error('File upload failed:', error);
        } finally {
            setUploading(false);
        }
    };
    return (
        <div className="file-upload">
            <div className="flex items-center gap-4">
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="block flex-1"
                />
                <button 
                    onClick={handleUpload} 
                    disabled={uploading}
                    className={`btn-primary flex-shrink-0 w-32 py-1 transition ${uploading ? 'opacity-50' : ''}`}
                >
                    {uploading ? 'Uploading...' : 'Upload File'}
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
