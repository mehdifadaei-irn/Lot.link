"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import ChanceRoomCard from "../temp/ChanceRoomCard";
import { Button } from "../ui/button";

interface ChanceRoomListProps {
  chanceRoomAddresses: `0x${string}`[];
  activeChanceRoom: `0x${string}` | "";
}

const ChanceRoomList = ({
  chanceRoomAddresses,
  activeChanceRoom,
}: ChanceRoomListProps) => {
  const [stepTracker, setStepTracker] = useState<number>(0);

  useEffect(() => {
    if (activeChanceRoom !== "" && chanceRoomAddresses.length !== 0) {
      console.log(chanceRoomAddresses.length, "lenAddresss");
      let couner =
        chanceRoomAddresses.reverse().indexOf(activeChanceRoom) -
        chanceRoomAddresses.length +
        1;
      setStepTracker(couner * 10);
    } else {
      setStepTracker(0);
    }
  }, [activeChanceRoom]);

  return (
    <div className="w-f overflow-x-hidden !h-[220px] ">
      {/* <h1>hell</h1> */}
      <div className="flex flex-col h-full">
        <div className="flex justify-between pl-2 pr-7 items-center pt-2">
          <p className="font-handjet font-semibold text-lg text-slate-100 pl-4 ">
            Chancerooms
          </p>
          <div className="flex gap-x-2">
            <Button
              className={
                "bg-transparent w-[33px] h-[35px] !p-0 border text-slate-100 border-neutral-700 hover:!bg-slate-800 transition-all duration-300 rounded-lg"
              }
              variant={"secondary"}
              onClick={() => {
                if (stepTracker >= 0) {
                  return;
                } else {
                  setStepTracker((prev) => prev + 10);
                }
              }}
            >
              <ChevronLeft size={25} />
            </Button>
            <Button
              className={
                "bg-transparent w-[33px] h-[35px] !p-0 border text-slate-100 border-neutral-700 hover:!bg-slate-800 transition-all duration-300 rounded-lg"
              }
              variant={"secondary"}
              onClick={() => {
                if (stepTracker <= -50) {
                  return;
                } else {
                  setStepTracker((prev) => prev - 10);
                }
              }}
            >
              <ChevronRight size={25} />
            </Button>
          </div>
        </div>
        <div
          className="flex gap-x-12 items-center flex-1 px-6 overflow-x-hidden w-[1757px] transition-all duration-300 ease-in-out"
          style={{
            transform: `translateX(${stepTracker}%)`,
          }}
        >
          {chanceRoomAddresses
            .slice(-10)
            .reverse()
            .map((chanceRoomAdd, i) => {
              return (
                <ChanceRoomCard
                  key={chanceRoomAdd}
                  chanceRoomAddress={chanceRoomAdd}
                  active={chanceRoomAdd === activeChanceRoom}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ChanceRoomList;
