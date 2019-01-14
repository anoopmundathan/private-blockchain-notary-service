const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const blockChainController = require('./controllers');


const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

blockChainController(app);


app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
});
