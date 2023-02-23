const sleep = require("util").promisify(setTimeout);
const {
  getStats,
  predictionContract,
  checkBalance,
  saveRound,
  claimRewards,
  progressBar,
  strategySoracode
} = require("./lib");

// Global Config
const GLOBAL_CONFIG = {
  BET_AMOUNT: 3, // in USD
  DAILY_GOAL: 30, // in USD,
  WAITING_TIME: 261000, // in Miliseconds (4.3 Minutes)
  THRESHOLD: 50, // Minimum % of certainty of signals (50 - 100)
};

//Init
console.log("🤗  Welcome! Pancakeswap Prediction Ultrabot V2 by Soracode");
progressBar(GLOBAL_CONFIG, false, false)
checkBalance(GLOBAL_CONFIG.AMOUNT_TO_BET);

//Betting
predictionContract.on("StartRound", async (epoch) => {
  console.log("🥞 Starting round " + ((epoch-1).toString()));
  claimRewards(epoch, GLOBAL_CONFIG);
  progressBar(GLOBAL_CONFIG, GLOBAL_CONFIG.WAITING_TIME-10000, epoch)
  await sleep(GLOBAL_CONFIG.WAITING_TIME);
  await strategySoracode(GLOBAL_CONFIG, epoch)
});

//Show stats
predictionContract.on("EndRound", async (epoch) => {
  await saveRound(epoch);
  let stats = await getStats();
  process.stdout.clearLine();
  process.stdout.write('\n');
  console.log(`--------------------------------`);
  console.log(`🍀  Fortune: ${stats.percentage} `);
  console.log(`👍  ${stats.win}|${stats.loss} 👎`);
  console.log(`💰  Profit: ${stats.profit_USD.toFixed(3)} USD`);
  console.log("--------------------------------");
});
