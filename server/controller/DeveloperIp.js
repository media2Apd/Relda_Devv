// import DeveloperIP from "../models/DeveloperIP";
const DeveloperIP = require('../models/DeveloperIP')
// / Add a new developer IP
const addDeveloperIP = async (req, res) => {
    const { ipAddress } = req.body;
    try {
        const exists = await DeveloperIP.findOne({ ipAddress });
        if (exists) return res.status(409).json({ message: 'IP already exists in developer list.' });

        const newIP = new DeveloperIP({ ipAddress });
        await newIP.save();
        res.status(201).json({ message: 'Developer IP added successfully.', data: newIP });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding developer IP.' });
    }
};

// Remove a developer IP      
const removeDeveloperIP = async (req, res) => {
    const { ipAddress } = req.body;
    try {
        const deleted = await DeveloperIP.findOneAndDelete({ ipAddress });
        if (!deleted) return res.status(404).json({ message: 'IP not found in developer list.' });

        res.status(200).json({ message: 'Developer IP removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing developer IP.' });
    }
};

module.exports={
    addDeveloperIP,
    removeDeveloperIP
}