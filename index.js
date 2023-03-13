const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const uuid = require('uuid');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

morgan.token('id', function (req) {
  return req.id;
});

const assignId = function (req, _res, next) {
  req.id = uuid.v4();
  next();
};

app.use(assignId);
app.use(
  morgan(
    ':id :remote-addr :date[clf] :method :url HTTP/:http-version :status :res[content-type] :res[content-length] :response-time ms'
  )
);

app.get('/api', (_req, res) => {
  // To set a single HTTP response header
  res.append('X-Timestamp', new Date());
  res.setHeader('X-Sent', true);

  // To set multiple HTTP response headers
  res.set({
    Authorization: 'Bearer 39889239jksjdjsd90007xnceswsbd76',
    'Bearer-Format': 'JWT',
    'Token-Expiry-Date': new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.header({
    Author: 'Shubham Purwar',
    Email: 'shubhampurwar35@gmail.com',
  });

  // To set Content-Type header
  res.type('text/plain');

  // To set Location header
  res.location(__filename);

  // Accessing all response headers
  console.log(res.getHeaders(), res.getHeaderNames());

  // Accesssing a single response header
  console.log(res.getHeader('Authorization'), res.get('Author'));

  res.status(200).send('Welcome');
});

// Sending file as it is
app.get('/api/send/:filename', (req, res) => {
  const { filename } = req.params;

  const options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'X-Timestamp': new Date(),
      'X-Sent': true,
    },
  };

  res.status(200).sendFile(filename, options, err => {
    if (err) {
      res.end();
    } else {
      console.log('File sent successfully');
    }
  });
});

// Sending file as an attachment to download
app.get('/api/download/:filename', (req, res) => {
  const { filename } = req.params;

  const options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'X-Timestamp': new Date(),
      'X-Sent': true,
    },
  };

  res.status(200).download(filename, options, err => {
    if (err) {
      res.end();
    } else {
      console.log('File successfully sent as an attachment');
    }
  });
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
