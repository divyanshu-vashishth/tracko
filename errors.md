1/4/2026, 1:17:46 PM [CONVEX A(stocks:getQuotes)] [LOG] 'Additionally, your yahoo-finance2 version out of date: 0.0.1 < 3.11.2 (latest)'  
1/4/2026, 1:17:46 PM [CONVEX A(stocks:getQuotes)] [ERROR] 'Failed to fetch quote for ADANIENT' Error: Failed Yahoo Schema validation      
    at validate (convex:/user/stocks.js:6803:11)
    at moduleExec (convex:/user/stocks.js:7218:5)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async quote (convex:/user/stocks.js:12003:74)
    at async handler (convex:/user/stocks.js:33441:19)
    at async invokeFunction (convex:/user/_deps/node/RVH45YSE.js:1117:9)
    at async invokeAction (convex:/user/_deps/node/RVH45YSE.js:1177:10)
    at async executeInner (bundledFunctions.js:39475:17)
    at async execute (bundledFunctions.js:39420:19)
    at bundledFunctions.js:39377:21 {
  name: 'FailedYahooValidationError',
  result: [
    {
      language: 'en-US',
      region: 'US',
      quoteType: 'EQUITY',
      typeDisp: 'Equity',
      triggerable: false,
      customPriceAlertConfidence: 'LOW',
      corporateActions: [],
      esgPopulated: false,
      hasPrePostMarketData: false,
      priceHint: 2,
      epsForward: 70.56,
      tradeable: false,
      cryptoTradeable: false,
      symbol: 'ADANIENT'
    }
  ],
  errors: [
    {
      instancePath: '/0',
      schemaPath: '#/definitions/QuoteResponseArray/items',
      message: 'should match some schema in oneOf',
      params: [Object],
      data: [Object],
      subErrors: [Array]
    }
  ]
}
✔ 13:28:03 Convex functions ready! (8.35s)