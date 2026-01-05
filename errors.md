1/5/2026, 5:51:15 PM [CONVEX A(stocks:getQuotes)] [WARN] '[yahoo-finance2] Unsupported environment: Requires Node >= 22.0.0, found 20.19.5. (runtime=node, version=20.19.5). Things might break or work unexpectedly!'
✔ Added table indexes:
  [+] chatHistory.by_user   userId, _creationTime
  [+] journalEntries.by_user   userId, _creationTime
  [+] journalEntries.by_user_date   userId, date, _creationTime
✔ 18:09:48 Convex functions ready! (11.72s)
✖ Error: Unable to start push to https://formal-lemur-79.convex.cloud
✖ Error fetching POST  https://formal-lemur-79.convex.cloud/api/deploy2/start_push 400 Bad Request: InvalidModules: Hit an error while pushing:
Loading the pushed modules encountered the following
    error:
`deleteJournalEntry` defined in `journal.js` is a Mutation function. Only actions can be defined in Node.js. See https://docs.convex.dev/functions/actions for more details.
✖ Error: Unable to start push to https://formal-lemur-79.convex.cloud
✖ Error fetching POST  https://formal-lemur-79.convex.cloud/api/deploy2/start_push 400 Bad Request: InvalidModules: Hit an error while pushing:
Loading the pushed modules encountered the following
    error:
`clearChatHistory` defined in `chatHistory.js` is a Mutation function. Only actions can be defined in Node.js. See https://docs.convex.dev/functions/actions for more details.