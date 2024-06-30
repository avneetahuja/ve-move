import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { performTransaction } from './performTransaction';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from Node.js!');
});

interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

//
app.post('/transaction', async (req, res) => {
    const { userAddress , rewardQty } = req.body;
    console.log("User Address: ", userAddress);
    console.log("Reward Quantity: ", rewardQty);
  
    try {
      
      const result: TransactionResult = await performTransaction(userAddress, rewardQty);
      console.log("Line before error")
      console.log(result)
      console.log("Line after error")
      if (result.success) {
        res.status(200).send({ message: 'Transaction successful', result });
      } else {
        res.status(500).send({ message: 'Transaction failed', error: result.error || "Unknown error"});
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ message: 'Transaction failed', error: error.message });
      } else {
        res.status(500).send({ message: 'Transaction failed', error: 'Unknown error' });
      }
    }
  });


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
