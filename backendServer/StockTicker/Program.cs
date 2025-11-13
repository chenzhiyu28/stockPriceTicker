// Program.cs

using StockTicker.Hubs;
using StockTicker.Services;

namespace StockTicker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // --- 依赖注入 (DI) / 服务注册 ---

            // 1. (重要!) 修复 CORS 策略
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    policy =>
                    {
                        // a. (重要!) 明确指定你的 React App 地址
                        //    (把 5173 换成你的端口号)
                        policy.WithOrigins("http://localhost:5173")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              // b. (重要!) SignalR 握手 *必须* 有这个
                              .AllowCredentials();
                    });
            });

            // 2. 注册 SignalR (不变)
            builder.Services.AddSignalR();

            // 3. 注册我们的后台股票服务 (不变)
            builder.Services.AddSingleton<StockTickerService>();
            builder.Services.AddHostedService(provider => provider.GetRequiredService<StockTickerService>());


            var app = builder.Build();

            // --- 中间件 (Middleware) 和 路由 (Routing) ---

            // (我们注释掉了 HTTPS 重定向)
            // app.UseHttpsRedirection();

            // 1. 使用 CORS (不变)
            app.UseCors("AllowSpecificOrigin");

            // 2. (保留) 我们的“拉取 (Pull)” API (不变)
            app.MapGet("/api/data", (StockTickerService stockService) =>
            {
                return Results.Ok(stockService.GetStocks());
            });

            // 3. (新增) 我们的“推送 (Push)” Hub (不变)
            app.MapHub<StockHub>("/stockhub");

            // --- 运行服务器 ---
            app.Run();
        }
    }
}