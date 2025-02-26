using Imenik.Data;
using Imenik.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("Imenik");
builder.Services.AddSqlServer<ImenikContext>(connString);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        policy =>
        {
            policy.AllowAnyOrigin()   
                  .AllowAnyMethod()   
                  .AllowAnyHeader();  
        });
});

var app = builder.Build();

await app.MigrateDbAsync();

app.UseCors("AllowAllOrigins");

app.MapControllers();

app.Run();