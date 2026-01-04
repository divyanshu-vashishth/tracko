
Basic Search

import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

// Search by ticker
const results = await yahooFinance.search('AAPL');
console.log(results.quotes[0]); // { symbol: 'AAPL', shortname: 'Apple Inc.', ... }

// Search by company name
const google = await yahooFinance.search('Alphabet');
console.log(google.quotes); // [{ symbol: 'GOOGL', ... }, { symbol: 'GOOG', ... }]


Advanced Search Options

// Limit results and get news
const results = await yahooFinance.search('Tesla', {
  quotesCount: 5,
  newsCount: 10
});

console.log(results.quotes.length); // Up to 5 quotes
console.log(results.news.length);   // Up to 10 news articles

// Regional search
const ukResults = await yahooFinance.search('Vodafone', {
  region: 'GB',
  lang: 'en-GB'
});


Working with Results

const results = await yahooFinance.search('Microsoft');

// Find exact symbol match
const msft = results.quotes.find(q => q.symbol === 'MSFT');
if (msft && 'shortname' in msft) {
  console.log(msft.shortname); // "Microsoft Corporation"
}

// Get all equity symbols
const equities = results.quotes.filter(q =>
  'quoteType' in q && q.quoteType === 'EQUITY'
);

// Browse news articles
results.news.forEach(article => {
  console.log(`${article.title} - ${article.publisher}`);
});

// Check performance timing
console.log(`Search took ${results.totalTime}ms total`);
console.log(`Quotes: ${results.timeTakenForQuotes}ms`);
console.log(`News: ${results.timeTakenForNews}ms`);


Notes
See SearchOptions for all available options, e.g.

Fuzzy Matching: When enabled, allows approximate matching for typos and partial company names.
See SearchResult for complete result structure, comprising:

Yahoo Finance Symbols: Stocks, ETFs, funds, etc. with trading data
Non-Yahoo Entities: Companies / startups from Crunchbase (isYahooFinance: false)
News Articles: Related financial news and analysis
Research reports
Performance: detailed timing information for different search components, useful for performance monitoring and optimization.
Functions
search
Search for financial instruments with validation enabled.
Interfaces
SearchNews
No documentation available
link
providerPublishTime
publisher
relatedTickers
thumbnail
title
type
uuid
SearchNewsThumbnailResolution
No documentation available
height
tag
url
width
SearchOptions
Configuration options for search requests.
enableCb
enableEnhancedTrivialQuery
enableFuzzyQuery
enableNavLinks
lang
multiQuoteQueryId
newsCount
newsQueryId
quotesCount
quotesQueryId
region
SearchQuoteNonYahoo
No documentation available
index
isYahooFinance
name
permalink
SearchQuoteYahoo
Base interface for all Yahoo Finance search quote results.
dispSecIndFlag
exchDisp
exchange
index
industry
isYahooFinance
longname
nameChangeDate
newListingDate
prevName
score
sector
shortname
symbol
SearchQuoteYahooCryptocurrency
No documentation available
quoteType
typeDisp
SearchQuoteYahooCurrency
No documentation available
quoteType
typeDisp
SearchQuoteYahooEquity
No documentation available
industryDisp
quoteType
sectorDisp
typeDisp
SearchQuoteYahooETF
No documentation available
quoteType
typeDisp
SearchQuoteYahooFund
No documentation available
quoteType
typeDisp
SearchQuoteYahooFuture
No documentation available
quoteType
typeDisp
SearchQuoteYahooIndex
No documentation available
quoteType
typeDisp
SearchQuoteYahooMoneyMarket
No documentation available
quoteType
typeDisp
SearchQuoteYahooOption
No documentation available
quoteType
typeDisp
SearchResult
Complete search result containing quotes, news, and other information.
count
culturalAssets
explains
lists
nav
news
quotes
researchReports
screenerFieldResults
timeTakenForAlgowatchlist
timeTakenForCrunchbase
timeTakenForCulturalAssets
timeTakenForNav
timeTakenForNews
timeTakenForPredefinedScreener
timeTakenForQuotes
timeTakenForResearchReports
timeTakenForScreenerField
timeTakenForSearchLists
totalTime

@gadicc/yahoo-finance2
modules/search
search
Search for symbols (Ctrl+/)
function search
search(
this: ModuleThis,
query: string,
queryOptionsOverrides?: SearchOptions,
moduleOptions?: ModuleOptionsWithValidateTrue,
): Promise<SearchResult>
Search for financial instruments with validation enabled.

See the search module docs for examples and more.

Parameters
this: ModuleThis
query: string
Search term (symbol, company name, or keywords)
optional
queryOptionsOverrides: SearchOptions
Optional search configuration
optional
moduleOptions: ModuleOptionsWithValidateTrue
Optional module configuration
Return Type
Promise<SearchResult>
Promise resolving to validated SearchResult

See
search module docs for examples and more.
search(
this: ModuleThis,
query: string,
queryOptionsOverrides?: SearchOptions,
moduleOptions?: ModuleOptionsWithValidateFalse,
): Promise<unknown>
Search for financial instruments with validation disabled.

See the search module docs for examples and more.

Parameters
this: ModuleThis
query: string
Search term (symbol, company name, or keywords)
optional
queryOptionsOverrides: SearchOptions
Optional search configuration
optional
moduleOptions: ModuleOptionsWithValidateFalse
Module configuration with validateResult: false
Return Type
Promise<unknown>
Promise resolving to unvalidated raw data

See
search module docs for examples and more.

@gadicc/yahoo-finance2
modules/search
Search for symbols (Ctrl+/)
Search module for finding financial instruments and related information.

This module provides search functionality to find stocks, ETFs, mutual funds, and other financial instruments by name, symbol, or keywords. It also returns related news articles and other relevant information.

Examples
