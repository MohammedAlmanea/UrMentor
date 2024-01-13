import express from 'express';
import { connectDB } from './config/db';
import { passportSetup } from './config/passportSetup'


const app = express();
const PORT = 5600;
app.use(express.json());

connectDB();
passportSetup();

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});