import type { StockPrice } from "../types";

interface StockTableProps {
  stocks: StockPrice[];
}

export function StockTable({ stocks }: StockTableProps) {
  return (
    <table className="table table-striped table-hover shadow-sm">
      <thead className="thead-dark bg-dark text-white">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Price ($)</th>
          <th scope="col">Last Update</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock) => (
          <tr key={stock.name}>
            <td>{stock.name}</td>
            <td>{stock.price.toFixed(2)}</td>
            <td>{new Date(stock.timeStamp).toLocaleTimeString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
