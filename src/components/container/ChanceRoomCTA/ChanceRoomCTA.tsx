"use client";
import { cn } from "@/lib/utils";
import { ConnectKitButton } from "connectkit";
import { CircleHelp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Button } from "../../ui/button";
import CTADialog from "./CTADialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/stores/store";
import { RoomAbi } from "@/assets/abi/mainAbi";
import { polygon } from "viem/chains";
import { parseEther } from "viem";

interface CTAProps {
  chanceRoomAddress: `0x${string}`;
}

const ChanceRoomCTA = ({ chanceRoomAddress }: CTAProps) => {
  const [isClient, setIsClient] = useState(false);
  const { isConnected } = useAccount();

  const { chanceRoomStatus } = useSelector(
    (state: RootState) => state?.spinner
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: hash, writeContract } = useWriteContract();

  function handleRollUp() {
    if (chanceRoomStatus[0] === "Sold out") {
      if (chanceRoomStatus[1] === "Waiting for roll up") {
        ///do spin
        writeContract({
          address: chanceRoomAddress,
          abi: RoomAbi,
          functionName: "rollup",
          chainId: polygon.id,
          args: [],
          value: parseEther("0.5"),
        });
      }
      if (chanceRoomStatus[1] === "Waiting for refund call") {
        writeContract({
          address: chanceRoomAddress,
          abi: RoomAbi,
          functionName: "refund",
          chainId: polygon.id,
          args: [],
          value: parseEther("0.5"),
        });
      }
    }
  }

  if (!isClient) {
    return (
      <div
        className={cn("h-full w-full  rounded-lg border-borderColor border")}
      ></div>
    );
  }

  return (
    <div
      className={cn("h-full w-full  rounded-lg", {
        "border-primary border-[2.5px]": chanceRoomStatus[0] !== "Sold out",
        "border-gray-800 border": chanceRoomStatus[0] === "Sold out",
      })}
    >
      <div className={cn("w-full flex  h-full justify-center items-center")}>
        <div
          className={cn("flex flex-col", {
            "!hidden": isConnected,
            "!flex": !isConnected,
          })}
        >
          <div
            className={cn(
              "border h-11 border-neutral-700 w-fit rounded-2xl hover:bg-slate-400/20 duration-300 transition-all",
              {
                "!hidden ": isConnected,
                "!block ": !isConnected,
              }
            )}
          >
            <ConnectKitButton />
          </div>
          <div
            className={cn("flex items-center ", {
              "!hidden": isConnected,
              "!flex": !isConnected,
            })}
          >
            <p className="font-handjet font-bold text-[16px] text-slate-200">
              Enter now to Buy <span className="text-primary">Ticket</span>
            </p>
            <CircleHelp
              color="#333"
              size={18}
              className="ml-1 cursor-pointer"
            />
          </div>
        </div>

        {/*  */}
        <div
          className={cn(
            "w-full lg:h-full max-lg:min-h-32 flex lg:flex-col flex-row ",
            {
              "!flex": isConnected,
              "!hidden": !isConnected,
            }
          )}
        >
          <div className="flex lg:!h-1/2 max-lg:w-1/2 justify-center items-center flex-col">
            <CTADialog
              disabled={chanceRoomStatus[0] === "Sold out"}
              chanceRoomAddress={chanceRoomAddress}
            />
          </div>
          <div className="flex lg:!h-1/2 max-lg:w-1/2 justify-center items-center flex-col">
            <div className="flex flex-col items-start w-2/3">
              <Button
                className=" tracking-wide font-bold text-base w-full  bg-lime-500"
                variant={"secondary"}
                onClick={handleRollUp}
              >
                {chanceRoomStatus[1] === "Waiting for roll up" && "RollUp"}
                {chanceRoomStatus[1] === "Waiting for refund call" && "Refund"}
                {chanceRoomStatus[1] === "Winner selected" && "Winner Selected"}
              </Button>

              {chanceRoomStatus[1] !== "Winner selected" && (
                <p className="font-handjet font-bold text-start text-[16px] text-slate-200 flex items-center pl-2">
                  {chanceRoomStatus[1] === "Waiting for roll up" &&
                    "RollUp ChanceRoom"}{" "}
                  {chanceRoomStatus[1] === "Waiting for refund call" &&
                    "Refund to get your tickets"}{" "}
                  <CircleHelp
                    color="#333"
                    size={18}
                    className="ml-1 cursor-pointer"
                  />
                </p>
              )}
            </div>
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  );
};

export default ChanceRoomCTA;
