// to use this backend, need to change the "timeStamp" type in frontend from string to Date


import express from 'express';
import cors from 'cors';
import { stockService } from './services/stockService';
import { initWebSocketServer } from './socket';


const app = express();
app.use(cors());
app.use(express.json());

// routing 
app.get("/api/data", (req, res) => {
    const stocks = stockService.getStocks();
    res.json(stocks);
});

const PORT = 3000;
export const server = app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`try visiting: http://localhost:${PORT}/api/data`);
})

initWebSocketServer(server);