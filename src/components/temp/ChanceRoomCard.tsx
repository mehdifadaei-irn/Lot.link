"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import { useReadContracts } from "wagmi";
import { FactoryContract } from "@/constants";
import { Factory } from "lucide-react";
import { polygon } from "viem/chains";
import { RoomAbi } from "@/assets/abi/mainAbi";
import { formatEther } from "viem";
import Link from "next/link";

interface ChanceRoomCardProps {
  chanceRoomAddress: `0x${string}` | undefined;
  active: boolean;
}

interface ContractResult {
  result?: {
    ticketPrice?: bigint;
  };
}

const ChanceRoomCard = ({
  chanceRoomAddress,
  active = false,
}: ChanceRoomCardProps) => {
  const { data, isLoading, refetch, queryKey, isSuccess } = useReadContracts({
    contracts: [
      {
        address: chanceRoomAddress,
        abi: RoomAbi,
        functionName: "status",
        chainId: polygon.id,
      },
      {
        address: chanceRoomAddress,
        abi: RoomAbi,
        functionName: "layout",
        chainId: polygon.id,
      },
      {
        address: chanceRoomAddress,
        abi: RoomAbi,
        functionName: "tokenURI",
        args: ["0"],
        chainId: polygon.id,
      },
      {
        address: chanceRoomAddress,
        abi: RoomAbi,
        functionName: "name",
        chainId: polygon.id,
      },
      {
        address: chanceRoomAddress,
        abi: RoomAbi,
        functionName: "lockedNFT",
        chainId: polygon.id,
      },
    ],
  });
  // //@ts-ignore
  const parseTokenURI = (result: string | null): string | null => {
    try {
      const parsed = result ? JSON.parse(result) : null;
      if (parsed && typeof parsed === "object" && "image" in parsed) {
        return parsed.image;
      }
      return null;
    } catch (error) {
      console.error("Error parsing token URI:", error);
      return null;
    }
  };

  const parseTokenURI1 = useCallback((result: string | null): string | null => {
    try {
      const parsed = result ? JSON.parse(result) : null;
      if (parsed && typeof parsed === "object" && "image" in parsed) {
        return parsed.image;
      }
      return null;
    } catch (error) {
      console.error("Error parsing token URI:", error);
      return null;
    }
  }, []);

  const nice1 = useMemo(() => {
    if (isSuccess && Array.isArray(data)) {
      //@ts-ignore
      let parsed = atob(data[2].result?.slice(29).toString());
      return parseTokenURI1(parsed);
    }
  }, [isSuccess]);

  if (isLoading) {
    return null;
  }

  return (
    <Link
      href={`/${chanceRoomAddress}`}
      className="!w-[226px] !p-0 transition-all duration-200 hover:bg-neutral-800 border border-borderColor !m-0 !rounded-xl shadow-lg h-40 cursor-pointer"
      style={{
        borderColor: active ? "#22c55e" : "#475569",
        borderWidth: active ? "2px" : "1px",
        opacity: ["Waiting for roll up", "Waiting for refund call"].includes(
          //@ts-ignore
          data[0]?.result?.at(1)
        )
          ? 1
          : 0.7,
      }}
    >
      <div className="w-full h-32 rounded-t-xl">
        <Image
          src={nice1 || ""}
          // src={parsed}
          width={126}
          height={50}
          alt="nft"
          className="rounded-t-xl !max-w-none"
        />
      </div>
      <div className="!h-8 flex flex-col justify-  w-full   text-slate-100 text-[12px] -translate-y-1 ">
        <span className="tracking-tight">
          {(data?.at(3)?.result as string)?.slice(0, 15)}
        </span>
        {/* <span className="tracking-tight">{chanceRoomAddress?.slice(-1)}</span> */}
        <div className="flex justify-between px-1 w-full">
          <span>
            {
              //@ts-ignore
              formatEther((data?.at(1)?.result as string).Uint256?.ticketPrice)
            }{" "}
            Matic
          </span>
          <span className="">
            {
              //@ts-ignore
              (data?.at(1)?.result as string).Uint256?.maximumTicket.toString()
            }
            {"/"}
            {
              //@ts-ignore
              (data?.at(1)?.result as string).Uint256?.soldTickets.toString()
            }
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ChanceRoomCard;
