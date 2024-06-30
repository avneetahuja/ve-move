import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { performTransaction,DAO_VERIFY } from './performTransaction';

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
    const {sLatitude, sLongitude, eLatitude, eLongitude, sTime, eTime, modeOfTransport, userAddress , rewardQty} = req.body;
    console.log('Transaction request received:', {sLatitude, sLongitude, eLatitude, eLongitude, sTime, eTime, modeOfTransport, userAddress , rewardQty})
    try {
      const result2 = await DAO_VERIFY(sLatitude, sLongitude, eLatitude, eLongitude, parseInt(sTime), parseInt(eTime), modeOfTransport);
      console.log('DAO_VERIFY result:', result2);
      if (!result2) {
        res.status(401).send({ message: 'Invalid Ride, you dont get any DAO for it' });
        return "Google Failed"
      }
      const result: TransactionResult = await performTransaction(userAddress, rewardQty);
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
