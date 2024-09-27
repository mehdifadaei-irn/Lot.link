import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useReadContract, useReadContracts } from "wagmi";
import { RoomAbi } from "@/assets/abi/mainAbi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/stores/store";
import { setMainPieData } from "@/redux/spinner/spinnerSlice";
import { isPending } from "@reduxjs/toolkit";
import PlayerCard from "../temp/PlayerCard";
import { polygon } from "viem/chains";

interface PlayersProps {
  chanceRoomAddress: `0x${string}`;
}

const Players = ({ chanceRoomAddress }: PlayersProps) => {
  const {
    data: contractDataLayout,
    isLoading: isLayoutLoading,
    isSuccess: layoutSuccess,
  } = useReadContract({
    address: chanceRoomAddress,
    abi: RoomAbi,
    functionName: "layout",
    chainId: polygon.id,
  });
  const {
    data: WinnerData,
    isLoading: isWinnerLoading,
    isSuccess: isWinnerSuccess,
    isError: isWinnerError,
  } = useReadContract({
    address: chanceRoomAddress,
    abi: RoomAbi,
    functionName: "winner",
    chainId: polygon.id,
  });

  const SpinnerMainPieData = useSelector(
    (state: RootState) => state?.spinner.pieData
  );

  const dispatch = useDispatch<AppDispatch>();

  // console.log(WinnerData, "winner");
  //0x0000000000000000000000000000000000000000

  const {
    data: Events,
    mutate,
    mutateAsync,
    isPending,
    isError,
    isSuccess,
    
  } = useMutation({
    mutationKey: ["getEvents", `${chanceRoomAddress}`],
    mutationFn: async () => {
      const response = await fetch(
        `https://deep-index.moralis.io/api/v2.2/${chanceRoomAddress}/events?chain=polygon&topic=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`,
        {
          method: "POST",
          //@ts-ignore
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY,
          },
          body: JSON.stringify({
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          }),
        }
      );

      const data = await response.json();

      return data;
    },
    onSuccess(data) {
      const TotalTickets: number = parseInt(
        //@ts-ignore
        contractDataLayout?.Uint256?.maximumTicket
      );

      let mainArrayData = data.result;
      mainArrayData.pop();

      let firstArr: any = [];
      let compList: string[] = [];

      mainArrayData.map((item: any, i: any) => {
        if (!compList.includes(item.data.tokenId)) {
          for (let index = TotalTickets; index > 0; index--) {
            if (item.data.tokenId == index) {
              firstArr.push(item);
              compList.push(index.toString());
              break;
            }
          }
        }
      });

      let emptyRemain = TotalTickets - compList.length;

      let pied = firstArr.reduce((acc: any, cur: any) => {
        let addressTo: string = cur.data.to.toString();

        if (cur.data.to === "0x0000000000000000000000000000000000000000") {
          emptyRemain++;
        } else {
          if (acc[addressTo]) {
            acc[addressTo.toString()]++;
          } else {
            acc[addressTo] = 1;
          }
        }
        return acc;
      }, {});
      pied[chanceRoomAddress] = emptyRemain;

      // console.log(pied, "PIECKE")

      const arr: any = Object.entries(pied).map(([key, value]) => ({
        [key]: value,
      }));

      let marpiData = arr.map((obj: any) => ({
        name: Object.keys(obj)[0],
        value: Object.values(obj)[0],
      }));

      dispatch(setMainPieData(marpiData));

      // console.log(marpiData, "PDDDD??");

      //@ts-ignore
      // setWinIndex((prev: any) => {

      // })

      // marpiData.map((pi, i: any) => {
      //   // console.log(pi,Winner,"re")
      //   if (
      //     pi.name.toString().toLowerCase() == Winner.toString().toLowerCase()
      //   ) {
      //     console.log("how");
      //     setWinIndex(i);
      //   }
      // });
    },
  });

  useEffect(() => {
    if (layoutSuccess) {
      mutate();
    }
  }, [isLayoutLoading]);

  if (isPending) {
    <div>
      <h1 className="text-slate-200">is Pending...</h1>
    </div>;
  }
  if (isError || isWinnerError) {
    <div>
      <h1 className="text-slate-200">Error happend...</h1>
    </div>;
  }

  return (
    <div className="w-full max-h-[85vh] overflow-y-auto no-scrollbar">
      <div className="w-full h-full flex flex-col pt-4 px-3 ">
        {/* */}
        {SpinnerMainPieData.length === 0 ||
        isLayoutLoading ||
        isWinnerLoading ? (
          <div className="">
            <h3 className="font-handjet text-slate-300 font-bold text-xl">
              Players
            </h3>
            {new Array(5).fill(null).map((_, i) => {
              return (
                <div
                  className="pt-2 flex-col flex w-full h-[67px] rounded-2xl"
                  key={i}
                >
                  <div className="px-2 mt-2 flex animate-pulse bg-gray-800 w-full h-full rounded-lg"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <h3 className="font-handjet text-slate-300 font-bold text-xl">
              {SpinnerMainPieData.length - 1} Players
            </h3>
            <div className="pt-2 flex-col flex gap-y-2 group/list">
              {SpinnerMainPieData.map((data, i) => {
                return (
                  <PlayerCard
                    key={data.name}
                    chanceRoomAddress={chanceRoomAddress}
                    playerAddress={data.name as `0x${string}`}
                    playerTickets={data.value}
                    playerIndex={i}
                    //@ts-ignore
                    totallSupply={contractDataLayout?.Uint256?.maximumTicket}
                    winner={WinnerData?.at(1) as `0x${string}`}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Players;
