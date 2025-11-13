// Services/StockTickerService.cs

using Microsoft.AspNetCore.SignalR;
using StockTicker.Hubs;

namespace StockTicker.Services
{
    public class StockTickerService : BackgroundService
    {
        private readonly IHubContext<StockHub> _hubContext;

        private readonly List<StockPrice> _stocks;
        private readonly Random _random = new();

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

        // scheduled task
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                for (int i = 0; i < _stocks.Count; i++)
                {
                    var stock = _stocks[i];
                    var newPrice = stock.Price * (1 + (_random.NextDouble() - 0.5) * 0.1);
                    _stocks[i] = stock with
                    {
                        Price = Math.Round(newPrice, 2),
                        TimeStamp = DateTime.Now
                    };
                }

                await _hubContext.Clients.All.SendAsync("ReceivePrices", _stocks, stoppingToken);
                await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
            }
        }

        //Polling API
        public List<StockPrice> GetStocks()
        {
            return _stocks;
        }
    }
}