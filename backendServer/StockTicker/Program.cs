using StockTicker.Hubs;
using StockTicker.Services;

namespace StockTicker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // --- DI ---
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5173")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
            });

            builder.Services.AddSignalR();
            builder.Services.AddSingleton<StockTickerService>();
            builder.Services.AddHostedService(provider => provider.GetRequiredService<StockTickerService>());


            var app = builder.Build();

            // --- Middleware and Routing
            app.UseCors("AllowSpecificOrigin");

            // polling request API
            app.MapGet("/api/data", (StockTickerService stockService) =>
            {
                return Results.Ok(stockService.GetStocks());
            });

            // push request API
            app.MapHub<StockHub>("/stockhub");

            app.Run();
        }
    }
}