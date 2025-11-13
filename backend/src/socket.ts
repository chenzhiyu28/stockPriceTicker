import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import { stockService } from "./services/stockService";



export function initWebSocketServer(httpServer: Server) {
    const wss = new WebSocketServer({ server: httpServer });
    const clients = new Set<WebSocket>();
    console.log('WebSocket Server initialized and attached.');

    // connect
    wss.on("connection", (ws: WebSocket) => {
        console.log("Client connected!")
        clients.add(ws);

        // disconnect
        ws.on("close", (ws: WebSocket) => {
            console.log("client disconnected!")
            clients.delete(ws);
        });
        
        // error
        ws.on("error", (error: Error) => {
            console.error('WebSocket error:', error);
            clients.delete(ws); 
        });
    });

    
    stockService.on("prices_updated", (stocks) => {
        const data = JSON.stringify(stocks);

        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        }
    });
};