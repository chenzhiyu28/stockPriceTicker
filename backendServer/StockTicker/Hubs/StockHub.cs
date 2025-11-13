// Hubs/StockHub.cs

using Microsoft.AspNetCore.SignalR;

namespace StockTicker.Hubs
{
    // 这就是 C# 版的 "WebSocket 服务器"
    // 它继承自 'Hub'，SignalR 框架会自动管理
    // 客户端的连接和断开
    public class StockHub : Hub
    {
        // 我们的设计是服务器“主动推送”
        // 所以客户端不需要调用服务器上的任何方法
        // 因此，这个类目前是空的，它只作为一个“通道”。
    }
}