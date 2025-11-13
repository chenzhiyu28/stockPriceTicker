// import { useState, useEffect } from "react";
// import { StockChart } from "./components/StockChart";
// import { StockTable } from "./components/StockTable";

// interface StockHistoryData {
//   time: string;
//   price: number;
// }

// interface StockPrice {
//   name: string;
//   price: number;
//   timeStamp: Date;
// }

// function App() {
//   const [stocks, setStocks] = useState<StockPrice[]>([]);
//   const [history, setHistory] = useState<Record<string, StockHistoryData[]>>(
//     {}
//   );

//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:3000");

//     socket.onopen = () => console.log("✅ WebSocket Connected!");
//     socket.onclose = () => console.log("WebSocket Disconnected.");
//     socket.onerror = (error) => console.error("WebSocket Error:", error);

//     socket.onmessage = (event) => {
//       const newStocks: StockPrice[] = JSON.parse(event.data);
//       setStocks(newStocks);

//       setHistory((prevHistory) => {
//         const newHistory = { ...prevHistory };
//         for (const stock of newStocks) {
//           const newPoint: StockHistoryData = {
//             time: new Date(stock.timeStamp).toLocaleTimeString(),
//             price: stock.price,
//           };
//           const oldStockHistory = prevHistory[stock.name] || [];
//           const newStockHistory = [...oldStockHistory, newPoint].slice(-20);
//           newHistory[stock.name] = newStockHistory;
//         }
//         return newHistory;
//       });
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);

//   return (
//     <div className="container mt-2">
//       {Object.keys(history).length > 0 && (
//         <div className="mb-5">
//           <StockChart history={history} />
//         </div>
//       )}

//       {stocks.length > 0 ? (
//         <StockTable stocks={stocks} />
//       ) : (
//         <div className="alert alert-info" role="alert">
//           Connecting to server... Waiting for data...
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
