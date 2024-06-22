const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Read the API URL from an environment variable
app.use(cors());
const apiUrl = process.env.API_URL || 'http://localhost:8050/api/v1/greeting';
app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading index.html');
            return;
        }
        // Replace placeholder with actual API URL
        const result = data.replace('%%API_URL%%', apiUrl);
        res.send(result);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
