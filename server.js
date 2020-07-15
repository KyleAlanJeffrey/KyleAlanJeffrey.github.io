const express = require('express');
const app = express();

const PORT = process.env.PORT || 30000;
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log('Now listening on port ' + PORT);
});