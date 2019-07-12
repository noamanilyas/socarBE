import http from 'http';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';

import homeRouter from './routes/home';
import adminRouter from './routes/admin';
import db from './dbConfig';

const hostname = '127.0.0.1';
const port = 3000;
const app = express() // setup express application
const server = http.createServer(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(logger('dev')); // log requests to the console

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/home', homeRouter);
app.use('/admin', adminRouter);

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the default API route',
}));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});