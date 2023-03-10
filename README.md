  
# ð¥NEW â¡ð® PancakeSwap Prediction UltraBot V2 ð®â¡
Are you interested in winning big on PancakeSwap? Try the PancakeSwap Prediction UltraBot V2 with a win rate of ~75%! It's a browser-friendly tool that you can run on any device, including **Windows, iOS, IPhone, Android, and more**. This is the improved version of [this old repository](https://github.com/Soracode/pancakeswap-prediction-smartbot)


## âï¸ð¥NEW Features
 - [x] ð§  Powerful algorithm V2!
 - [x] âï¸ Better win rate
 - [x] ð¨ Brand new UI
 - [x] ð Runs on browser
 - [x] ð¥ Auto claim prizes
 - [x] â³ Current round progress bar + ETA
 - [x] ð Accurate BNB live prices
 - [x] â¡ Resume bet super fast
 - [x] ð¤ Smaller fees (0,15% on winning profit)


## ðâ¡ Run it on browser

1. Fork this repo to your github account
2. Login with github: (https://codesandbox.io/dashboard/repositories?utm_source=landingpage)
3. Go to 'Import repository'
4. Import the forked repository
5. Setup credentials on .env
6. Click start

## âï¸ How to Setup

1. Create account and API KEY on [BSCScan](https://bscscan.com/myapikey) (To get accurate prices)
2. Open the **.env** file with any code/text editor and add your private key and bscscan key like so:
```
PRIVATE_KEY=0xa2hjtjnhutdavmasoracodentxevx6j6fasidauxcppyqmuekj54
BSC_KEY= Your BSCScan Key
```
3. Start the bot clicking Start
4. ð® Enjoy!

### ð How to convert seed phrase to Private Key
A lot of wallets don't provide you the private key, but just the **seed phrase** ( 12 words ). So here you will learn how to convert that to a private key:
1. Enter [Here](https://youtu.be/eAXdLEZFbiw) and follow the instructions. Website used is [this one](https://iancoleman.io/bip39/).


## ð¤ð Strategy
- The bot follows a series of algorithms and proccess them together with the tendency of the rest of people betting. After the algorithm have complete, it choose to bet **ð¢UP** or **ð´DOWN**.
- After testing it in around 500 rounds, I was able to achieve a ~75% Win rate. However, keep in mind that it depends on various factors, so I cannot guarantee that you will reproduce the same behavior. I make $20 - $70 daily with $3 bets.
- Before every round the bot will check if you have any unclaimed prize to claim and if you have reached the daily goal.
- Also it will save the daily history in the **/history** directory.


## ð¡ Use recomendations
 - [x] Min bet: $3 (less will result on poor performance)
 - [x] Min operating time: 5h (the longer the time, the more the UP/DOWN bets stabilize)
 - [x] Open bot on a new window (to don't forget it open)
 - [x] Statistically after consecutive losses you have more chances to win in the next one
 - [x] You can run it locally just downloading the repo and ``npm i`` ``npm start``


## ð°â¡ Local Installation
(Ignore this if running on browser)

Download and Install Node here:
https://nodejs.org/en/download/

Then run the following commands in terminal:

1. ``git clone https://github.com/Soracode/pancakeswap-prediction-ultrabot-v2`` 
2. ``cd pancakeswap-prediction-ultrabot-v2``
3. ``npm i``


ð§**The code is in BETA, so please be aware of the risks that come with it.**
Don't risk any money you're not willing to lose.

**This code, repository or scripts should NOT be construed as investment advice.**

 **Use it at your own risk.** 
 If you are going to bet, please do it with money that you are willing to lose. And please try to bet with a low amount to gradually generate profit. Please note that there's a small fee only on wins. If you want to remove this, contact me (`bananarancia@protonmail.com`).
