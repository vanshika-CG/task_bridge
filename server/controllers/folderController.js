const Folder = require('../models/folderModel');

exports.createFolder = async (req, res) => {
    try {
        const { name, team_code, parent_folder } = req.body;

        if (!name || !team_code) {
            return res.status(400).json({ message: 'Folder name and team code are required' });
        }

        const newFolder = new Folder({
            name,
            team_code,
            parent_folder: parent_folder || null,
            created_by: req.user._id
        });

        const savedFolder = await newFolder.save();
        res.status(201).json(savedFolder);
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getFolders = async (req, res) => {
    try {
        const folders = await Folder.find({ team_code: req.params.team_code })
            .populate('created_by', 'full_name')
            .populate('parent_folder', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(folders);
    } catch (error) {
        console.error('Error fetching folders:', error);
        res.status(500).json({ message: error.message });
    }
}; 