"use client";

import { useState, useEffect, useRef } from "react";
import TextField from "./components/TextField";
import prices from "./data/prices";
import { FaArrowDown } from "react-icons/fa6";
import { on } from "events";



export default function Home() {
  const pricesDict: Record<string, number> = {};

  const pricesName: string[] = [];
  
  prices.forEach(({ currency, price }) => {
    pricesDict[currency] = price; 
    if (!pricesName.includes(currency)) {
      pricesName.push(currency);
    }
  });

  const [sellCrypto, setSellCrypto] = useState(0); // In retrospect, should have used string (while float when doing calculations)
  const [sellUSD, setSellUSD] = useState(0);
  const [currentSellToken, setCurrentSellToken] = useState("ETH");
  const [isSellToken, setIsSellToken] = useState(true);



  const [buyCrypto, setBuyCryptoValue] = useState(0);
  const [buyUSD, setBuyUSD] = useState(0);
  const [currentBuyToken, setCurrentBuyToken] = useState("");
  const [isBuyToken, setIsBuyToken] = useState(true);

  const prevSellCrypto = useRef(sellCrypto);
  const prevSellUSD = useRef(sellUSD);
  const prevBuyCrypto = useRef(buyCrypto);
  const prevBuyUSD = useRef(buyUSD);

  const switchBuySell = () => {
    const tempSellCrypto = sellCrypto;
    const tempSellUSD = sellUSD;
    const tempCurrentSellToken = currentSellToken;
    const tempIsSellToken = isSellToken;

    setSellCrypto(buyCrypto);
    setSellUSD(buyUSD);
    setCurrentSellToken(currentBuyToken);
    setIsSellToken(isBuyToken);

    setBuyCryptoValue(tempSellCrypto);
    setBuyUSD(tempSellUSD);
    setCurrentBuyToken(tempCurrentSellToken);
    setIsBuyToken(tempIsSellToken);
  }

  const onSellCryptoChange = (value: any) => {
    const cryptoValue = value;
    const usdValue = value * pricesDict[currentSellToken];
    const buyCryptoValue = usdValue / pricesDict[currentBuyToken];

    setSellCrypto(cryptoValue);
    setSellUSD(usdValue);
    setBuyUSD(usdValue);
    setBuyCryptoValue(buyCryptoValue);
  }

  const onSellUSDChange = (value: any) => {
    const usdValue = value;
    const sellCryptoValue = usdValue / pricesDict[currentSellToken];
    const buyCryptoValue = usdValue / pricesDict[currentBuyToken];
    setSellUSD(usdValue);
    setSellCrypto(sellCryptoValue);
    setBuyUSD(usdValue);
    setBuyCryptoValue(buyCryptoValue);
  }

  const onBuyCryptoChange = (value: any) => {
    const buyCryptoValue = value;
    const usdValue = buyCryptoValue * pricesDict[currentBuyToken];
    const sellCryptoValue = usdValue / pricesDict[currentSellToken];
    
    setBuyCryptoValue(buyCryptoValue);
    setBuyUSD(usdValue);
    setSellUSD(usdValue);
    setSellCrypto(sellCryptoValue);
  }

  const onBuyUSDChange = (value: any) => {
    const usdValue = value;
    const buyCryptoValue = usdValue / pricesDict[currentBuyToken];
    const sellCryptoValue = usdValue / pricesDict[currentSellToken];

    setBuyUSD(usdValue);
    setBuyCryptoValue(buyCryptoValue);
    setSellUSD(usdValue);
    setSellCrypto(sellCryptoValue);
  }

  const onSellTokenChange = (tokenStr: string) => {
    const newSellTokenValue = sellUSD / pricesDict[tokenStr];
    const newBuyTokenValue = sellUSD / pricesDict[currentBuyToken];
    setSellCrypto(newSellTokenValue);
    setBuyCryptoValue(newBuyTokenValue);
  }

  const onBuyTokenChange = (tokenStr: string) => {
    const newSellTokenValue = sellUSD / pricesDict[currentSellToken];
    const newBuyTokenValue = sellUSD / pricesDict[tokenStr];
    setSellCrypto(newSellTokenValue);
    setBuyCryptoValue(newBuyTokenValue);
  }

  
  return (
    
    <div className="flex flex-col justify-center items-center h-dvh bg-[#141414]">
      <TextField 
        label="Sell"
        value={isSellToken ? sellCrypto : sellUSD}
        subValue={isSellToken ? sellUSD : sellCrypto}
        currentToken={currentSellToken}
        onTokenChange={onSellTokenChange}
        pricesName={pricesName}
        isToken={isSellToken}
        setCurrentToken={setCurrentSellToken}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          isSellToken ? onSellCryptoChange(Number(e.target.value)) : onSellUSDChange(Number(e.target.value))
        }
        isTokenToggle={setIsSellToken}
      />

      <div className="relative flex justify-center items-center 
        bg-[#212121] hover:bg-[#424242] active:bg-[#292929]
        w-[45px] h-[45px] bottom-0 m-[-20px] border-3 border-[#141414]
        border-1 rounded-xl z-10 cursor-pointer" 
        onClick={() => switchBuySell()}
      >
        <FaArrowDown
          size={28}
          color="#fff"
        />
      </div>

      <TextField 
        label="Buy"
        value={isBuyToken ? buyCrypto : buyUSD}
        subValue={isBuyToken ? buyUSD : buyCrypto}
        pricesName={pricesName}
        onTokenChange={onBuyTokenChange}
        isToken={isBuyToken}
        currentToken={currentBuyToken}
        setCurrentToken={setCurrentBuyToken}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value.replace(/\D/g, "");
          isBuyToken ? onBuyCryptoChange(Number(value)) : onBuyUSDChange(Number(value));

        }}
        isTokenToggle={setIsBuyToken}
      />

      <div 
        className="flex items-center justify-center 
        bg-[#361a37] hover:bg-[#572a58] max-w-[470px] w-[95%] 
          rounded-xl mt-4 cursor-pointer active:opacity-80
          p-3"
        onClick={() => window.open("https://github.com/tanshiyu1999/currency-swap-form", "_blank")}
          >
        <a className="text-[#fc72ff] text-lg font-bold">Source Code</a>
      </div>
      <div 
        className="flex items-center justify-center 
        bg-[#361a37] hover:bg-[#572a58] max-w-[470px] w-[95%] 
          rounded-xl mt-4 cursor-pointer active:opacity-80
          p-3"
        onClick={() => window.open("https://github.com/tanshiyu1999/currency-swap-form/blob/main/oa/messy_react.tsx", "_blank")}
          >
        <a className="text-[#fc72ff] text-lg font-bold">Messay React</a>
      </div>

      <div 
        className="flex items-center justify-center 
        bg-[#361a37] hover:bg-[#572a58] max-w-[470px] w-[95%] 
          rounded-xl mt-4 cursor-pointer active:opacity-80
          p-3"
        onClick={() => window.open("https://github.com/tanshiyu1999/currency-swap-form/blob/main/oa/sum_to_n.js", "_blank")}
          >
        <a className="text-[#fc72ff] text-lg font-bold">Sums to n</a>
      </div>
      
    </div>
  );
}
