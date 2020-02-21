require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '127.0.0.1';
const proj_dir = `/home/amey/Projects/compound-finance-borrow`;

app.use(express.static('client'));

// Serves the home page of the project
app.get('/index', (req, res) => {
  res.sendFile(`${proj_dir}/client/index.html`);
});

// Serves the standard error page
app.get('*', (req, res) => {
  res.status(404);
  res.send('Oops... this URL does not exist');
});

app.listen(PORT, IP, () => {
  console.log(`Compound Finance Dapp running on port ${PORT}...`);
});
