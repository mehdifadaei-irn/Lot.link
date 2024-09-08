"use client";

import React, { useState } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";

import NewTabIcon from "@/../public/assets/svgs/NewTab.svg";

import { Button, buttonVariants } from "../ui/button";
import Image from "next/image";
import { addressMinimizer } from "@/lib/utils";
import { Files, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
import PriceCard from "../temp/PriceCard";

const HoverContent = () => {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [openTooltip, setOpenTooltip] = useState<boolean>(false);

  //   const result = useBalance({
  //     address: "0x4557B18E779944BFE9d78A672452331C186a9f48",
  //   });

  //   console.log(result);

  return (
    <div className="text-slate-200 flex flex-col ">
      <div className="flex justify-between items-center mt-3">
        <p className="font-bold text-base tracking-tight">Connected Wallet</p>
        <div className="flex items-center h-7">
          <TooltipProvider>
            <Tooltip open={openTooltip}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(address || "");
                    setOpenTooltip(true);
                  }}
                  onMouseLeave={() => setOpenTooltip(false)}
                  className="flex px-2 items-center gap-x-2 active:bg-slate-700  rounded-l-lg h-7 border-borderColor border cursor-pointer duration-300 transition-all hover:bg-slate-600"
                >
                  <span className="text-[14px] tracking-tighter flex items-center ">
                    {addressMinimizer(address || "0x0")}
                  </span>
                  <Files size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>copeid!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link
            target="_blank"
            href={`https://polygonscan.com/address/${address}`}
            className="border rounded-r-lg bg-slate-800 h-7 px-2 flex items-center justify-center border-borderColor cursor-pointer duration-300 transition-all hover:bg-slate-600"
          >
            <SquareArrowOutUpRight size={16} />
          </Link>
        </div>
      </div>
      {/*  */}
      <div className="border border-borderColor p-2 mt-4 rounded-lg">
        <PriceCard />
        {/* <PriceCard/>        */}
        <Link
          href={""}
          className={buttonVariants({
            className: "w-full flex gap-x-2 items-center mt-6",
          })}
        >
          <span className="font-handjet font-semibold text-[16px] tracking-wide">
            Buy Lott
          </span>
          <SquareArrowOutUpRight size={16} />
        </Link>
        <Link
          href={""}
          className={buttonVariants({
            className: "w-full mt-3 flex gap-x-2 items-center",
            variant: "secondary",
          })}
        >
          <span className="font-handjet font-semibold text-[16px] tracking-wide">
            Move Funds
          </span>
          <SquareArrowOutUpRight size={16} />
        </Link>
        <Button
          variant={"outline"}
          className="w-full mt-3 flex font-handjet font-semibold text-[16px] hover:!text-slate-200 gap-x-2 items-center tracking-wide !border-borderColor duration-300 transition-all hover:bg-slate-700"
          onClick={() => disconnect()}
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
};

export default HoverContent;
