const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Read the API URL from an environment variable
app.use(cors());
const apiUrl = process.env.API_URL || 'http://localhost:8050/api/v1/greeting';
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index', { apiEndpoint: apiUrl });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
