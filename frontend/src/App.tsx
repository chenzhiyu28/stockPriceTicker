import { useState, useEffect } from "react";
import { StockChart } from "./components/StockChart";
import { StockTable } from "./components/StockTable";
import * as signalR from "@microsoft/signalr";

const CSHARP_SERVER_URL = "http://localhost:5160";

interface CSharpStockPrice {
  name: string;
  price: number;
  timeStamp: string;
}

interface StockHistoryData {
  time: string;
  price: number;
}

interface StockPrice {
  name: string;
  price: number;
  timeStamp: string;
}

function App() {
  // --- State Management ---
  const [stocks, setStocks] = useState<StockPrice[]>([]);
  const [history, setHistory] = useState<Record<string, StockHistoryData[]>>(
    {}
  );

  // --- Data Fetching ---
  useEffect(() => {
    // SignalR Builder
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${CSHARP_SERVER_URL}/stockhub`)
      .withAutomaticReconnect()
      .build();

    // 5. Listen
    connection.on("ReceivePrices", (newStocks: CSharpStockPrice[]) => {
      const formattedStocks: StockPrice[] = newStocks.map((stock) => ({
        name: stock.name,
        price: stock.price,
        timeStamp: stock.timeStamp,
      }));

      setStocks(formattedStocks);

      setHistory((prevHistory) => {
        const newHistory = { ...prevHistory };
        for (const stock of formattedStocks) {
          const newPoint: StockHistoryData = {
            time: new Date(stock.timeStamp).toLocaleTimeString(),
            price: stock.price,
          };
          const oldStockHistory = prevHistory[stock.name] || [];
          const newStockHistory = [...oldStockHistory, newPoint].slice(-20);
          newHistory[stock.name] = newStockHistory;
        }
        return newHistory;
      });
    });

    async function start() {
      try {
        await connection.start();
        console.log("✅ SignalR Connected to C#!");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        setTimeout(start, 5000);
      }
    }

    start();

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Stock Price Ticker</h1>

      {Object.keys(history).length > 0 && (
        <div className="mb-5 shadow-sm p-3 bg-white rounded">
          <StockChart history={history} />
        </div>
      )}

      {stocks.length > 0 ? (
        <StockTable stocks={stocks} />
      ) : (
        Object.keys(history).length === 0 && (
          <div className="alert alert-info" role="alert">
            Connecting to C# server... Waiting for data...
          </div>
        )
      )}
    </div>
  );
}

export default App;
