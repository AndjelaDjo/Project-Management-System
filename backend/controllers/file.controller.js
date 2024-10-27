const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/project.model');
const Activity = require('../models/activity.model');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

const upload = multer({ storage });

const uploadFile = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            const { projectId } = req.params;
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            const fileData = {
                fileName: file.originalname,
                filePath: file.path,
            };

            project.files.push(fileData);
            await project.save();

            await Activity.create({
                message: `File "${fileData.fileName}" uploaded to project "${project.name}"`,
                type: 'project',
                action: 'file_uploaded',
                userId: req.user._id,
                projectId: project._id
            });

            res.status(200).json({ file: fileData });
        } catch (error) {
            res.status(500).json({ error: 'Error uploading file' });
        }
    });
};

const deleteFile = async (req, res) => {
    const { projectId, fileId } = req.params;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const fileIndex = project.files.findIndex(file => file._id.toString() === fileId);
        if (fileIndex === -1) {
            return res.status(404).json({ error: 'File not found' });
        }

        const filePath = project.files[fileIndex].filePath;
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else {
            return res.status(404).json({ error: 'File does not exist on the server' });
        }

        await Activity.create({
            message: `File "${project.files[fileIndex].fileName}" deleted from project "${project.name}"`,
            type: 'project',
            action: 'file_deleted',
            userId: req.user._id,
            projectId: project._id
        });

        project.files.splice(fileIndex, 1);
        await project.save();

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error during file deletion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { uploadFile, deleteFile };
