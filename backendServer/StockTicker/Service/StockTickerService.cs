// Services/StockTickerService.cs

using Microsoft.AspNetCore.SignalR;
using StockTicker.Hubs;

namespace StockTicker.Services
{
    // 这就是 C# 版的 "stockService.ts"
    // 它作为后台服务运行 (IHostedService)
    public class StockTickerService : BackgroundService
    {
        // SignalR Hub 的“上下文”，用于广播消息
        // 这 100% 等同于 Spring Boot 的 @Autowired
        private readonly IHubContext<StockHub> _hubContext;

        // 内存中的数据存储
        private readonly List<StockPrice> _stocks;
        private readonly Random _random = new();

        // 构造函数 (Constructor)
        // .NET 的“依赖注入”系统会自动把 SignalR Hub 传进来
        public StockTickerService(IHubContext<StockHub> hubContext)
        {
            _hubContext = hubContext;

            _stocks = new List<StockPrice>
            {
                new StockPrice("Google", 176.26, DateTime.Now),
                new StockPrice("Apple", 189.99, DateTime.Now),
                new StockPrice("Microsoft", 429.04, DateTime.Now),
                new StockPrice("Tesla", 179.24, DateTime.Now)
            };
        }

        // 这是 C# 版的 "setInterval" 的执行体
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // 非阻塞循环
            while (!stoppingToken.IsCancellationRequested)
            {
                // 使用 'for' 循环来安全地修改 List
                for (int i = 0; i < _stocks.Count; i++)
                {
                    var stock = _stocks[i];

                    // 'Record' (记录) 是不可变的，
                    // 我们使用 'with' 关键字创建新拷贝
                    // (这和你 React State 的“不可变性”更新是相同概念)
                    var newPrice = stock.Price * (1 + (_random.NextDouble() - 0.5) * 0.1);

                    _stocks[i] = stock with
                    {
                        Price = Math.Round(newPrice, 2),
                        TimeStamp = DateTime.Now
                    };
                }

                // 广播 (Broadcast)！
                // 这 100% 等同于 Node.js 版的 "emit('prices_updated', ...)"
                // SignalR 会自动帮我们遍历所有客户端并发送
                // "ReceivePrices" 是我们将与 React 客户端约定的“频道名”
                await _hubContext.Clients.All.SendAsync("ReceivePrices", _stocks, stoppingToken);

                // 非阻塞等待 2 秒钟 (C# 版的 "非阻塞 sleep")
                await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
            }
        }

        // 这是 Polling API 使用的公共方法
        public List<StockPrice> GetStocks()
        {
            return _stocks;
        }
    }
}