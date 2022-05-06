"use strict";

import express from 'express';

const app = express();


app.get('/test', (req, res) => {
  res.json({ test: 'Hello world!' });
});


export = app;
