import { RoomAbi } from "@/assets/abi/mainAbi";
import { stringToColour } from "@/lib/generateColorFromAddress";
import { cn } from "@/lib/utils";
import { setSpinnerActiveIndex } from "@/redux/spinner/spinnerSlice";
import { AppDispatch, RootState } from "@/redux/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { formatEther } from "viem";
import { polygon } from "viem/chains";
import { useAccount, useReadContract } from "wagmi";

import GoldSvg from "@/../public/assets/svgs/gold.svg";

import Image from "next/image";
import { Crown } from "lucide-react";

interface PlayerCardProps {
  chanceRoomAddress: `0x${string}`;
  playerAddress: `0x${string}`;
  playerTickets: number;
  totallSupply: number;
  playerIndex: number;
  winner: `0x${string}`;
}

const PlayerCard = ({
  chanceRoomAddress,
  playerAddress,
  totallSupply,
  playerTickets,
  playerIndex,
  winner = "0x0000000000000000000000000000000000000000",
}: PlayerCardProps) => {
  const {
    data: ticketPrice,
    isLoading,
    isSuccess,
  } = useReadContract({
    address: chanceRoomAddress,
    abi: RoomAbi,
    functionName: "ticketPrice",
    chainId: polygon.id,
  });

  const SpinnerActiveIndex = useSelector(
    (state: RootState) => state?.spinner.spinnerActiveIndex
  );

  const { address, isConnected } = useAccount();

  const dispatch = useDispatch<AppDispatch>();

  if (playerTickets === 0) {
    return <div></div>;
  }
  return (
    <div
      className={cn(
        "group lg:hover:!opacity-100 lg:group-hover/list:opacity-50  px-2 flex flex-row justify-between w-full bg-slate-800 rounded-lg py-2 transition-all duration-300 hover:bg-gray-700 cursor-pointer relative   ",
        {
          "!opacity-100":
            SpinnerActiveIndex === playerIndex ||
            winner.toLocaleLowerCase() ===
              "0x0000000000000000000000000000000000000000",
          "opacity-50":
            SpinnerActiveIndex !== playerIndex &&
            SpinnerActiveIndex != undefined,
          "!border-yellow-400 border-r-8 ":
            winner.toLocaleLowerCase() === playerAddress.toLocaleLowerCase(),
          "opacity-70 ": !(
            winner.toLocaleLowerCase() !==
              "0x0000000000000000000000000000000000000000" &&
            winner.toLocaleLowerCase() === playerAddress.toLocaleLowerCase()
          ),
          "border-green-600 border-r-8":
            address?.toLocaleLowerCase() === playerAddress.toLocaleLowerCase(),
        }
      )}
      onMouseEnter={(e) => dispatch(setSpinnerActiveIndex(playerIndex))}
      onMouseLeave={(e) => dispatch(setSpinnerActiveIndex(undefined))}
    >
      <div className="flex gap-x-2 items-center">
        <div
          className="w-7 h-7 rounded-full"
          style={{
            backgroundColor: stringToColour(playerAddress),
          }}
        />
        <div className="flex flex-col">
          <span className="font-handjet flex items-center gap-x-1 font-semibold text-base text-gray-400">
            {playerAddress.slice(2, 7) === "00000"
              ? "empty"
              : playerAddress.slice(2, 7)}
            {winner.toLocaleLowerCase() ===
              playerAddress.toLocaleLowerCase() && (
              <Crown size={18} color="#FFD300" />
            )}
            {
              address?.toLocaleLowerCase() === playerAddress.toLocaleLowerCase() && (
                <span className="text-green-500 opacity-100">You</span>
              )
            }
          </span>
          <span className="font-handjet font-semibold text-base text-gray-200">
            {playerTickets} Tickets
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-handjet font-bold text-[15px]  text-slate-100">
          {/* @ts-ignore */}
          {((playerTickets / parseInt(totallSupply)) * 100).toFixed(2)}%
        </span>
        <span className="font-handjet font-semibold text-sm tracking-tight text-gray-200">
          {isLoading
            ? "lo"
            : //@ts-ignore
              (formatEther(ticketPrice as bigint) * playerTickets).toFixed(
                2
              )}{" "}
          Matic
        </span>
      </div>
      {/* <div className="">
        {!balanceOf
          ? "0"
          : ((parseInt(balanceOf) / totallSupply) * 100).toString().slice(0, 4)}
        %
      </div> */}
    </div>
  );
};

export default PlayerCard;
