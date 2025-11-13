import { useState, useEffect } from "react";
import { StockChart } from "./components/StockChart";
import { StockTable } from "./components/StockTable";
import * as signalR from "@microsoft/signalr";

const CSHARP_SERVER_URL = "http://localhost:5160"; // (改成你的端口号!)

interface CSharpStockPrice {
  name: string;
  price: number;
  timeStamp: string;
}

// 这是我们的图表组件需要的数据格式
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
  // --- 状态管理 (State Management) ---
  // (这部分 100% 和以前一样)
  const [stocks, setStocks] = useState<StockPrice[]>([]);
  const [history, setHistory] = useState<Record<string, StockHistoryData[]>>(
    {}
  );

  // --- 数据获取 (Data Fetching) ---
  useEffect(() => {
    // 4. "创建" 一个 SignalR "连接生成器 (Builder)"
    //    我们指向 C# Hub 的 URL
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${CSHARP_SERVER_URL}/stockhub`)
      .withAutomaticReconnect() // (SignalR 自动处理重连, 非常棒!)
      .build();

    // 5. "订阅" (Listen)
    //    这 100% 等同于 'socket.onmessage = ...'
    //    "ReceivePrices" 必须和你 C# 里的 "SendAsync" 字符串
    //    *完全* 匹配！
    connection.on("ReceivePrices", (newStocks: CSharpStockPrice[]) => {
      // 6. (数据转换)
      //    把 C# 传来的数据 (CSharpStockPrice[])
      //    转换成我们前端组件期望的格式 (StockPrice[])
      const formattedStocks: StockPrice[] = newStocks.map((stock) => ({
        name: stock.name,
        price: stock.price,
        timeStamp: stock.timeStamp, // C# 的 'camelCase' 完美匹配 JS/TS
      }));

      // 7. (更新 State - 这部分逻辑 100% 不变)
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

    // 8. "启动" 连接
    //    这是一个“异步 (async)”操作
    async function start() {
      try {
        await connection.start();
        console.log("✅ SignalR Connected to C#!");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        // (如果连接失败，5秒后重试)
        setTimeout(start, 5000);
      }
    }

    start();

    // 9. (清理)
    //    当组件卸载时，停止连接
    return () => {
      connection.stop();
    };
  }, []); // (空数组 [] 确保这只运行一次)

  // --- 渲染 (Rendering) ---
  // (这部分 100% 不变, 因为我们重构得很好)
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
