"use client";

import { useState } from "react";
import Modal from "./Modal";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";


type TokenProps = {
  setCurrentToken: (token: string) => void;
  pricesName: string[];
  currentToken?: string;
  onTokenChange: (tokenStr: string) => void;
};

export default function TokenButton({pricesName, setCurrentToken, currentToken, onTokenChange}: TokenProps) {


  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickToken = (tokenStr: string) => {
    onTokenChange(tokenStr);
    setCurrentToken(tokenStr);
    setIsModalOpen(false);
  };


  const [searchText, setSearchText] = useState(""); 

  const filteredTokens = pricesName.filter((name) => 
    name.toLowerCase().includes(searchText.toLowerCase())
  );

  const tokenDom = filteredTokens.map((name, index) => {
    return (
      <div 
        key={index} className="flex justify-start items-center pl-5 py-3 rounded-lg text-white bg-[#141414] active:opacity-80 hover:bg-[#1e1e1e] cursor-pointer space-x-2"
        onClick={() => onClickToken(name)}
      >
        <img src={`/tokens/${name}.svg`} alt={name} className="w-11 h-11" />
        <span className="text-2xl">{name}</span>
    
      </div>
    );
  }
  );

  return (
    <>
      <div className="flex justify-center rounded-3xl pl-1 bg-[#141414] cursor-pointer w-full "
        onClick={() => setIsModalOpen(true)}
      >
        {currentToken ? (
          <div className="flex items-center space-x-1 w-full  border py-[2px] px-1 border-gray-600 rounded-3xl">
            <img src={`/tokens/${currentToken}.svg`} alt={currentToken} className="w-7 h-7" />
            <span className="text-lg py-[2px] max-w-[70px] truncate text-white">{currentToken}</span>
            <MdKeyboardArrowDown 
              size={32} 
            />

          </div>
        ) : (
          <div className="flex items-center w-full bg-[#fc72ff] rounded-3xl">
            <span className="text-base py-[2px] px-3 font-bold text-white">Select Token</span>
            <MdKeyboardArrowDown 
              size={32} 
              color={"#fff"}
            />
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="h-full m-0 bg-[#141414] flex flex-col z-50">
          <div className="h-[90px]">
            <div className="flex flex-row text-lg text-white px-4 py-1 items-center justify-between">
              <span>Select a Token</span>
              <RxCross2 
                className="cursor-pointer"
                size={24}
                onClick={() => setIsModalOpen(false)}
              />
            </div>

            <div className="rounded-3xl p-3 bg-[#1d1d1d] flex items-center space-x-2 mx-3 my-2">
              <CiSearch 
                size={24}
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search tokens"
                className="focus:outline-none bg-transparent text-white"
              />

            </div>

          </div>

          <div className="flex-1 overflow-y-auto mt-2 space-y-1 pb-1 scrollbar-custom">
            {tokenDom}
          </div>
        </div>

      </Modal>


    </>



  


  );
}
