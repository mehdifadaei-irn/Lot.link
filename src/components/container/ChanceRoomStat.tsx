import { Loader2, Shell, TicketPercent } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import OpenSea from "@/../public/assets/svgs/OpenSea.svg";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { RoomAbi } from "@/assets/abi/mainAbi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/stores/store";
import { cn } from "@/lib/utils";
import { polygon } from "viem/chains";

interface ChanceRoomStatProps {
  chanceRoomAddress: `0x${string}`;
  Round: number;
  status?: string[];
}

const MockStat = true;

const ChanceRoomStat = ({ Round, chanceRoomAddress }: ChanceRoomStatProps) => {
  const {
    data: contractDataLayout,
    isLoading: isLayoutLoading,
    isSuccess: layoutSuccess,
    isError,
  } = useReadContract({
    address: chanceRoomAddress,
    abi: RoomAbi,
    functionName: "layout",
    chainId: polygon.id,
  });
  const { address, isConnected } = useAccount();

  const {
    data: playerTicket,
    isLoading: isplayerTicketLoading,
    isSuccess: isplayerTicketSuccess,
  } = useReadContract({
    address: chanceRoomAddress,
    abi: RoomAbi,
    functionName: "balanceOf",
    args: [`${address || "0x0000000000000000000000000000000000000000"}`],
    chainId: polygon.id,
  });

  const { pieData } = useSelector((state: RootState) => state?.spinner);

  let deadtime;

  const MaxTickets = useMemo(() => {
    //@ts-ignore
    return parseInt(contractDataLayout?.Uint256?.maximumTicket);
  }, [contractDataLayout]);
  const NFTId = useMemo(() => {
    //@ts-ignore
    return parseInt(contractDataLayout?.Uint256?.nftId);
  }, [contractDataLayout]);
  let timeLeft: number = -1;

  if (!isLayoutLoading) {
    //@ts-ignore
    let timstamp = `${contractDataLayout.Uint256?.deadLine
      .toString()
      .slice(0, -1)}${"0000"}`;

    deadtime = new Date(
      //@ts-ignore
      parseInt(timstamp)
    );
    timeLeft =
      //@ts-ignore
      parseInt(contractDataLayout?.Uint256?.deadLine) * 10e2 -
      new Date().getTime();
  }

  console.log(Number(playerTicket || 0) / MaxTickets, "pT");

  if (isError) {
    return (
      <div className="w-full text-slate-100 font-bold !min-h-64 px-3 pt-5 pb-4 ">
        <h1>Error happend</h1>
      </div>
    );
  }

  return (
    <div className="w-full !min-h-64 px-3 pt-5 pb-4 ">
      <div className="flex flex-col">
        <div className="flex justify-between w-full items-center">
          <span className="text-slate-200 font-bold font-handjet tracking-wide text-[19px]">
            Round {Round}
          </span>
          <div
            className={`flex items-center justify-center h-9 border-green-400 bg-teal-950 border-[1.5px]${
              timeLeft >= 0 ? " w-[100px] " : " w-[70px] "
            } rounded-xl`}
          >
            {timeLeft >= 0 ? (
              <span className="font-black text-2xl font-handjet text-green-400">
                09:90
              </span>
            ) : (
              <Shell color="#2fa" />
            )}
          </div>
        </div>
        {/*  */}
        <div className="w-full flex justify-between mt-2 ">
          <div className="justify-center items-start flex-col flex-1 flex">
            <Link
              target="_blank"
              href={`https://opensea.io/assets/matic/${chanceRoomAddress}/${NFTId}`}
              className="flex justify-center items-start flex-col"
            >
              <Image
                src={OpenSea}
                alt="OpenSea"
                className="h-7 w-7 mb-1 ml-2 "
              />
              <span className="text-muted-foreground text-[13px] pl-1 tracking-wide font-medium">
                OpenSea
              </span>
            </Link>
          </div>
          <div className="flex  gap-y-1 flex-col-reverse justify-center items-start mr-3 flex-1">
            <span className="text-muted-foreground text-[13px]  tracking-wide font-medium -translate-y-2">
              Suplly
            </span>
            {isLayoutLoading ? (
              <Loader2
                className="mt-1 mr-1 animate-spin scale-120"
                color="#fff"
              />
            ) : (
              <span className="font-semibold text-slate-100 tracking-wide">
                {/*  */}
                <span className="font-black text-[22px]">
                  {`${
                    //@ts-ignore
                    contractDataLayout["Uint256"].soldTickets.toString()
                  }`}
                </span>
                {""}

                <span className="text-muted-foreground font-medium ">
                  /{MaxTickets}
                </span>
              </span>
            )}
          </div>
        </div>
        {/*  */}
        <div className="w-full flex justify-between mt-2 border-b border-borderColor ">
          <div className="w-12 h-10 flex justify-center items-start flex-col flex-1 ">
            {isConnected && !isplayerTicketLoading ? (
              <div
                className={cn(
                  " flex gap-x-2 items-center flex-row-reverse font-bold ml-1 text-2xl ",
                  {
                    "text-muted-foreground": Number(playerTicket || 0) == 0,
                    "!text-muted-foreground": Number(playerTicket) == undefined,
                    "text-slate-100": Number(playerTicket || 0) !== 0,
                  }
                )}
              >
                {playerTicket?.toString()}
                <TicketPercent className="-rotate-45" color="#3b82f6" />
              </div>
            ) : (
              <>
                {isConnected ? (
                  <Loader2
                    className="mt-1 w-10 h-10 mr-1 animate-spin scale-120"
                    color="#fff"
                    size={35}
                  />
                ) : (
                  <span className="font-bold ml-1 text-2xl text-muted-foreground">
                    0
                  </span>
                )}
              </>
            )}
            <span className="text-muted-foreground text-[13px]  tracking-wide font-medium">
              Your Tickets
            </span>
          </div>

          <div className="flex  gap-y-1 flex-col-reverse justify-center items-start mr-3 flex-1">
            <span className="text-muted-foreground text-[13px] pl-1 tracking-wide font-medium -translate-y-2">
              Your Chance
            </span>
            {isLayoutLoading ? (
              <Loader2
                className="mt-1 mr-1 animate-spin scale-120"
                color="#fff"
              />
            ) : (
              <span
                className={cn("font-semibold  tracking-wide text-2xl", {
                  "text-muted-foreground":
                    Number(playerTicket || 0) / MaxTickets == 0,
                  "text-slate-100":
                    Number(playerTicket || 0) / MaxTickets !== 0,
                })}
              >
                {((Number(playerTicket || 0) / MaxTickets) * 100).toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/*  */}
        <div className="flex flex-col gap-y-1 pt-1">
          <div className="flex justify-between  text-slate-300">
            <span>Contract Address :</span>
            <Link
              href={""}
              className="underline text-slate-300 font-semibold text-lg"
            >
              {chanceRoomAddress.slice(0, 9)}
            </Link>
          </div>
          <div className="flex justify-between  text-slate-300">
            <span>Spain Date :</span>
            {deadtime == undefined ? (
              ""
            ) : (
              <span className="font-semibold text-lg">
                {`${deadtime?.getUTCDate()} ${deadtime?.toLocaleString(
                  "default",
                  {
                    month: "long",
                  }
                )} -${deadtime?.getUTCHours()}:${deadtime?.getUTCMinutes()}:${deadtime?.getUTCSeconds()} `}
                UTC
                {/* {modalContent.time} */}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChanceRoomStat;
