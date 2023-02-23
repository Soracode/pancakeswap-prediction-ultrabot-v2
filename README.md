  
# 🔥NEW ⚡🔮 PancakeSwap Prediction UltraBot V2 🔮⚡
Are you interested in winning big on PancakeSwap? Try the PancakeSwap Prediction UltraBot V2 with a win rate of ~75%! It's a browser-friendly tool that you can run on any device, including **Windows, iOS, IPhone, Android, and more**. This is the improved version of [this old repository](https://github.com/Soracode/pancakeswap-prediction-smartbot)


## ✔️🔥NEW Features
 - [x] 🧠 Powerful algorithm V2!
 - [x] ⚖️ Better win rate
 - [x] 🎨 Brand new UI
 - [x] 🌐 Runs on browser
 - [x] 🥇 Auto claim prizes
 - [x] ⏳ Current round progress bar + ETA
 - [x] 📈 Accurate BNB live prices
 - [x] ⚡ Resume bet super fast
 - [x] 🤝 Smaller fees (0,15% on winning profit)


## 🌐⚡ Run it on browser

1. Fork this repo to your github account
2. Login with github: (https://codesandbox.io/dashboard/repositories?utm_source=landingpage)
3. Go to 'Import repository'
4. Import the forked repository
5. Setup credentials on .env
6. Click start

## ⚙️ How to Setup

1. Create account and API KEY on [BSCScan](https://bscscan.com/myapikey) (To get accurate prices)
2. Open the **.env** file with any code/text editor and add your private key and bscscan key like so:
```
PRIVATE_KEY=0xa2hjtjnhutdavmasoracodentxevx6j6fasidauxcppyqmuekj54
BSC_KEY= Your BSCScan Key
```
3. Start the bot clicking Start
4. 🔮 Enjoy!

### 🔓 How to convert seed phrase to Private Key
A lot of wallets don't provide you the private key, but just the **seed phrase** ( 12 words ). So here you will learn how to convert that to a private key:
1. Enter [Here](https://youtu.be/eAXdLEZFbiw) and follow the instructions. Website used is [this one](https://iancoleman.io/bip39/).


## 🤖📈 Strategy
- The bot follows a series of algorithms and proccess them together with the tendency of the rest of people betting. After the algorithm have complete, it choose to bet **🟢UP** or **🔴DOWN**.
- After testing it in around 500 rounds, I was able to achieve a ~75% Win rate. However, keep in mind that it depends on various factors, so I cannot guarantee that you will reproduce the same behavior. I make $20 - $70 daily with $3 bets.
- Before every round the bot will check if you have any unclaimed prize to claim and if you have reached the daily goal.
- Also it will save the daily history in the **/history** directory.


## 💡 Use recomendations
 - [x] Min bet: $3 (less will result on poor performance)
 - [x] Min operating time: 5h (the longer the time, the more the UP/DOWN bets stabilize)
 - [x] Open bot on a new window (to don't forget it open)
 - [x] Statistically after consecutive losses you have more chances to win in the next one
 - [x] You can run it locally just downloading the repo and ``npm i`` ``npm start``


🔧**The code is in BETA, so please be aware of the risks that come with it.**
Don't risk any money you're not willing to lose.

**This code, repository or scripts should NOT be construed as investment advice.**

 **Use it at your own risk.** 
 If you are going to bet, please do it with money that you are willing to lose. And please try to bet with a low amount to gradually generate profit. Please note that there's a small fee only on wins. If you want to remove this, contact me (`bananarancia@protonmail.com`).
