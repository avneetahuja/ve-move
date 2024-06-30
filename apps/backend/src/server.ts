// import { App } from '@/app';
// import { ValidateEnv } from '@utils/validateEnv';
// import { initializeOpenAI } from './utils/initializeOpenAI';
// import { SubmissionRoute } from './routes/submission.route';

// ValidateEnv();

// export const openAIHelper = initializeOpenAI();

// const app = new App([new SubmissionRoute()]);



// app.listen();


// ************************************************************************** ///

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // You can change the port if needed

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from Node.js server!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




