"use client";

import TokenButton from "./TokenButton";
import numeral from "numeral";
import { useState } from "react";

type TextFieldProps = {
  label: string;
  value?: number;
  subValue?: number;
  pricesName: string[];
  onTokenChange: (token: string) => void;
  isToken: boolean;
  currentToken?: string;
  setCurrentToken: (tokenStr: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isTokenToggle: (isToken: boolean) => void;
};

const formatLargeNumber = (num: number) => {
  return num >= 1e6 ? numeral(num).format('0.00a').toUpperCase() : num.toFixed(2);
};

export default function TextField({label, value, pricesName, 
  setCurrentToken, subValue, onChange, isToken, isTokenToggle, currentToken,
  onTokenChange,
}: TextFieldProps) {

  const [inputLength, setInputLength] = useState(0)

  return (
    
    <div className="flex flex-col bg-[#141414] p-4 rounded-2xl max-w-[470px] w-[95%] border border-gray-600 active:bg-[#191919] z-5">
      <label className="text-lg text-white font-bold">{label}</label>
      <div className="flex flex-row w-[100%] bg-transparent items-center mt-1 text-gray-400">
        {currentToken ? (
         
          <div className="flex-1 flex flex-row items-center justify-start py-2">
            <div className="flex items-center">
              {!isToken && <span className="text-3xl text-white">$</span>}
              <input
                type="text"
                value={value ? parseFloat(value.toFixed(2)) : ""}
                placeholder="0"
                inputMode="numeric"
                onChange={(e) => {
                  const inputElement = e.target;
                  const inputLength = inputElement.value.length;
                  console.log(inputLength)
                  setInputLength(inputLength)
                  if (inputLength < 16) {
                    onChange(e)
                  }
                }}
                // className="focus:outline-none bg-transparent text-4xl w-full text-white"
                className={`focus:outline-none bg-transparent w-full text-white transition-all duration-100 ${inputLength > 14 ? "text-3xl" : "text-4xl"}`}
              />
            </div>
          </div>

        ) : (
          <span className="flex-1 text-4xl h-full">0</span>
        )}

        <div className="pl-2 flex-2">
          <TokenButton 
            currentToken={currentToken}
            setCurrentToken={setCurrentToken}
            onTokenChange={onTokenChange}
            pricesName={pricesName}
          />
        </div> 
      </div>
      {
        currentToken ?  (
          <div 
          className="text-sm cursor-pointer"
          onClick={() => isTokenToggle(!isToken)}
          >
            {isToken ? (
              <div className="flex space-x-2 mt-2">
                {subValue ? <span className="text-lg text-gray-400">${formatLargeNumber(parseFloat(subValue.toFixed(2)))}</span> : 
                  <span className="text-lg text-gray-400">$0</span>
                } 
              </div>
            ) : (
              <div className="flex space-x-2 mt-2">
                {subValue ? <span className="text-lg text-gray-400"> {formatLargeNumber(parseFloat(subValue.toFixed(2)))} {currentToken}</span> : 
                  <span className="text-lg text-gray-400">0 {currentToken}</span> 
                }
              </div>
            )}
          </div>
        ): <div className="my-1"></div>
      }
    </div>
  );
}
