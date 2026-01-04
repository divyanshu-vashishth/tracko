Chart module for retrieving historical price data with extensive customization options.

This module provides detailed historical price, volume, and event data for financial instruments, with flexible date ranges, intervals, and data formats. It's the primary source for building charts and conducting technical analysis.

Examples
Basic Usage

import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

// Get last year of daily data
const result = await yahooFinance.chart('AAPL', {
  period1: '2023-01-01',
  period2: '2024-01-01'
});

console.log(result.quotes[0]); // First day's OHLCV data
console.log(result.meta.currency); // "USD"


Different Time Intervals

// Intraday 5-minute data for last 5 days
const intraday = await yahooFinance.chart('TSLA', {
  period1: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  interval: '5m'
});

// Weekly data for 2 years
const weekly = await yahooFinance.chart('NVDA', {
  period1: '2022-01-01',
  period2: '2024-01-01',
  interval: '1wk'
});

// Monthly data for maximum available period
const monthly = await yahooFinance.chart('MSFT', {
  period1: new Date('1985-01-01'),
  interval: '1mo'
});


Object Format for Charting Libraries

// Get data in object format (better for some charting libraries)
const chartData = await yahooFinance.chart('GOOGL', {
  period1: '2023-06-01',
  period2: '2023-12-01',
  return: 'object'
});

// Access data by timestamp keys
const timestamps = chartData.timestamp;
const prices = chartData.indicators.quote[0];

timestamps.forEach((timestamp, index) => {
  console.log(`${new Date(timestamp * 1000)}: $${prices.close[index]}`);
});


Working with Events and Dividends

const data = await yahooFinance.chart('AAPL', {
  period1: '2020-01-01',
  period2: '2024-01-01',
  events: 'div|split|earn'
});

// Process dividends
if (data.events?.dividends) {
  data.events.dividends.forEach(dividend => {
    console.log(`Dividend: $${dividend.amount} on ${dividend.date}`);
  });
}

// Process stock splits
if (data.events?.splits) {
  data.events.splits.forEach(split => {
    console.log(`Split: ${split.splitRatio} on ${split.date}`);
  });
}


Cryptocurrency and International Markets

// Bitcoin data
const btc = await yahooFinance.chart('BTC-USD', {
  period1: '2024-01-01',
  interval: '1h'
});

// European stocks
const asml = await yahooFinance.chart('ASML.AS', {
  period1: '2023-01-01'
});

// Japanese stocks
const toyota = await yahooFinance.chart('7203.T', {
  period1: '2023-01-01'
});


Error Handling and Edge Cases

try {
  const result = await yahooFinance.chart('INVALID', {
    period1: '2023-01-01'
  });
} catch (error) {
  if (error.message.includes('No data found')) {
    console.log('Symbol may be delisted or invalid');
  }
}

// Handle potential empty results
const result = await yahooFinance.chart('AAPL', {
  period1: '2025-01-01' // Future date
});

if (result.quotes.length === 0) {
  console.log('No data available for the specified period');
}


Functions
chart
Fetch historical price, dividend, split and other data useful for charts.
Interfaces
ChartEventDividend
No documentation available
amount
date
ChartEventDividends
No documentation available
ChartEventsArray
No documentation available
dividends
splits
ChartEventsObject
No documentation available
dividends
splits
ChartEventSplit
No documentation available
date
denominator
numerator
splitRatio
ChartEventSplits
No documentation available
ChartIndicatorAdjclose
No documentation available
adjclose
ChartIndicatorQuote
No documentation available
close
high
low
open
volume
ChartIndicatorsObject
No documentation available
adjclose
quote
ChartMeta
No documentation available
chartPreviousClose
currency
currentTradingPeriod
dataGranularity
exchangeName
exchangeTimezoneName
fiftyTwoWeekHigh
fiftyTwoWeekLow
firstTradeDate
fullExchangeName
gmtoffset
hasPrePostMarketData
instrumentType
longName
previousClose
priceHint
range
regularMarketDayHigh
regularMarketDayLow
regularMarketPrice
regularMarketTime
regularMarketVolume
scale
shortName
symbol
timezone
tradingPeriods
validRanges
ChartMetaTradingPeriod
No documentation available
end
gmtoffset
start
timezone
ChartMetaTradingPeriods
No documentation available
post
pre
regular
ChartOptions
No documentation available
events
includePrePost
interval
lang
period1
period2
return
useYfid
ChartOptionsWithReturnArray
No documentation available
return
ChartOptionsWithReturnObject
No documentation available
return
ChartResultArray
No documentation available
events
meta
quotes
ChartResultArrayQuote
No documentation available
adjclose
close
date
high
low
open
volume
ChartResultObject
No documentation available
events
indicators
meta
timestamp