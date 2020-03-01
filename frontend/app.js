const express = require('express');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/index.html'));
});
app.use(express.static('./static'));
app.listen(80);