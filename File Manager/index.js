import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRoutes from './src/routes/users.js';
//import * as db from './src/db/db.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/",  userRoutes);
app.use(cors());

app.listen(PORT, () =>{
    console.log(`API is listening on port ${PORT}`);
});
 
