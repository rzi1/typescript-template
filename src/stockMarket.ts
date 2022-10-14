import { NS } from '@ns';
export async function main(ns: NS): Promise<void> {
  var stocks = ns.stock.getSymbols();
  for (var i in stocks) {
    var stock = stocks[i];
    var volatility = ns.stock.getVolatility(stock);
    var forecast = ns.stock.getForecast(stock);
    var price = ns.stock.getPrice(stock);
    ns.tprintf(
      'Stock: %s || Price: %d || Forecast: %f || Volatility: %f',
      stock,
      price,
      forecast,
      volatility
    );
  }
}
