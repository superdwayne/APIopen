const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/test', (req, res) => {
    const filePath = 'data.json';
    
    // First, check if the file exists and has content
    fs.readFile(filePath, (err, data) => {
        // Initialize an array to hold existing data
        let existingData = [];
        
        // If the file exists and has data, parse the data into the existingData array
        if (!err && data.length) {
            try {
                existingData = JSON.parse(data.toString());
                if (!Array.isArray(existingData)) { // Make sure existing data is an array
                    throw new Error('Existing data is not an array');
                }
            } catch {
                // If parsing fails or existing data isn't an array, return an error response
                res.status(500).json({ message: 'Failed to parse existing data' });
                return;
            }
        }
        
        // Add the new data to the array
        existingData.push(req.body);
        
        // Write the updated array back to the file
        fs.writeFile(filePath, JSON.stringify(existingData, null, 2), writeErr => {
            if (writeErr) {
                res.status(500).json({ message: 'Failed to write data' });
                return;
            }
            res.status(200).json({ message: 'Data received and saved', data: req.body });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
