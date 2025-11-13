import { EventEmitter } from "stream";
import { StockPrice } from "../types";


class StockService extends EventEmitter {
    private timeStamp = new Date();

    // mocked data
    private googleStockPrice: StockPrice = {name: "Google", price: 176.26, timeStamp: this.timeStamp};
    private appleStockPrice: StockPrice = {name: "Apple", price: 189.99, timeStamp: this.timeStamp};
    private microSoftStockPrice: StockPrice = {name: "MicroSoft", price: 429.04, timeStamp: this.timeStamp};
    private teslaStockPrice: StockPrice = {name: "Tesla", price: 179.24, timeStamp: this.timeStamp};

    private stocks: StockPrice[] = [
        this.googleStockPrice,
        this.appleStockPrice,
        this.microSoftStockPrice,
        this.teslaStockPrice,
    ];

    constructor() {
        super();
        this.startStockTicker();
    }

    private startStockTicker = () => {
        setInterval(() => {
            const currentTime = new Date();
            for (let stock of this.stocks) {
                stock.price = Number((stock.price * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2));
                stock.timeStamp = currentTime;
            }
            // console.log("Updated prices:", this.stocks);

            this.emit("prices_updated", this.stocks);
        }, 2000);
    };

    public getStocks(): StockPrice[] {
        return this.stocks;
    }
};


export const stockService = new StockService();