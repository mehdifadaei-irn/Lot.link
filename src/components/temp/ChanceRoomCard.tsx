"use client";
import { RoomAbi } from "@/assets/abi/mainAbi";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatEther } from "viem";
import { polygon } from "viem/chains";
import { useReadContracts } from "wagmi";

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
  const [parsedNice1, setParsedNice1] = useState<null | string>(null);
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
        args: [BigInt(0)],
        chainId: polygon.id,
      },
      {
        address: chanceRoomAddress,
        abi: RoomAbi,
        functionName: "name",
        chainId: polygon.id,
      },
    ],
  });

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

  // const nice1 = useMemo(() => {
  //   if (isSuccess && Array.isArray(data)) {
  //     //@ts-ignore
  //     // let parsed = atob(data[2].result?.slice(29).toString());
  //     let parsed2;
  //     if (data[2].result) {
  //       parsed2 = Buffer.from(data[2].result?.slice(29).toString(), "base64");
  //     }
  //     //@ts-ignore
  //     // console.log(JSON.parse(parsed2).image, "p22222");
  //     //@ts-ignore
  //     return parseTokenURI1(parsed2);

  //     // return parseTokenURI1(parsed);
  //   }
  // }, [data]);

  useEffect(() => {
    if (isSuccess && data[2].result && data[2].result?.slice(29)) {
      let parsed = Buffer.from(data[2].result?.slice(29).toString(), "base64");
      //@ts-ignore
      const nice1 = parseTokenURI1(parsed);
      setParsedNice1(nice1);
    }
  }, [isSuccess, data]);

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
        {parsedNice1 && (
          <Image
            src={parsedNice1 || ""}
            // src={parsed}
            width={126}
            height={50}
            alt={(data?.at(3)?.result as string)?.slice(0, 15) || ""}
            className="rounded-t-xl !max-w-none"
          />
        )}
      </div>
      <div className="!h-8 flex flex-col justify-  w-full   text-slate-100 text-[12px] -translate-y-1 ">
        <span className="tracking-tight">
          {(data?.at(3)?.result as string)?.slice(0, 15)}
        </span>
        {/* <span className="tracking-tight">{chanceRoomAddress?.slice(-1)}</span> */}
        <div className="flex justify-between px-1 w-full">
          <span>
            {formatEther(
              //@ts-ignore
              (data?.at(1)?.result as string).Uint256?.ticketPrice || 0
            )}{" "}
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
