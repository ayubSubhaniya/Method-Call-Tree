const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const CORS = require('cors');
const app = express();
const PORT = 8081;
// Routes
const analyseMethod = require('./routes/analyseMethod');
//const parseMethod = require('./routes/parseMethod');

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());

//middleware to allow cross origin access
app.use(CORS());

// Routes
app.use('/analyseMethod', analyseMethod);
//app.use('/parseMethod', parseMethod);

// Catch 404 Errors and forward them to error handler function
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    // response to client
    res.status(status).json({
        error: {
            message: error.message,
        },
    });

    // response to server
    console.error(err);
});

// start server
const port = app.get('port') || PORT;

app.listen(port, () => console.log(`Server is listnening on port ${port}`));
