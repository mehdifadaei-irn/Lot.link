"use client";
import { FactoryAbi } from "@/assets/abi/mainAbi";
import ChanceRoomList from "@/components/container/ChanceRoomList";
import MainPie from "@/components/container/MainPie";
import Players from "@/components/container/Players";
import { FactoryContract } from "@/constants";
import { polygon } from "viem/chains";
import { useReadContract } from "wagmi";

export default function Home() {
  const {
    data: chanceRooms,
    isError,
    isLoading,
    isSuccess,
  } = useReadContract({
    ...FactoryContract,
    functionName: "chanceRooms",
    chainId: polygon.id,
  });

  if (isError) {
    return (
      <main className="w-full">
        <div className="text-slate-100 min-[1500px]:max-w-[87vw] max-w-[1400px]  mx-auto xl:px-6 md:px-9 px-5 mt-20">
          <h1>Error happend</h1>
        </div>
      </main>
    );
  }

  // console.log(chanceRooms);
  return (
    <main className="w-full">
      <div className=" min-[1500px]:max-w-[87vw] max-w-[1400px]  mx-auto xl:px-6 md:px-9 px-5 mt-20">
        <div className="w-full h-[90vh] grid-container">
          {/* Players */}
          <div className="grid-players grid-item-box">
            {isLoading ? (
              <div className="w-full h-full" />
            ) : (
              <Players
                chanceRoomAddress={
                  (chanceRooms as Array<`0x${string}`>)?.at(-1)!
                }
              />
            )}
          </div>
          {/* MainSpinner */}
          <div className="grid-main grid-item-box ">
            {isLoading ? (
              <div className="h-[56vh]"></div>
            ) : (
              <MainPie
                chanceRoomAddress={
                  //@ts-ignore
                  (chanceRooms?.at(-1) as `0x${string}`) || ""
                }
              />
            )}
          </div>
          {/* STAT */}
          <div className="grid-stat grid-item-box">3</div>
          {/* ChanceRoomList. POT */}
          <div className="grid-pot grid-item-box ">
            {isLoading ? (
              <div className="w-f overflow-x-hidden !h-[220px] ">
                {/* <h1>hell</h1> */}
                <div className="flex flex-col h-full">
                  <div className="flex justify-start px-2 items-center pt-2">
                    <p className="font-handjet font-semibold text-lg text-slate-100 pl-4">
                      Chancerooms
                    </p>
                  </div>
                  <div className="flex justify-between items-center flex-1 px-6 w-[1000px]">
                    {new Array(5).fill(null).map((_, i) => {
                      return (
                        <div
                          key={i}
                          className="w-[126px]  h-40 relative animate-pulse aspect-square overflow-hidden rounded-md bg-gray-200 lg:aspect-none"
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <ChanceRoomList
                chanceRoomAddresses={
                  (chanceRooms as Array<`0x${string}`>) || [""]
                }
                activeChanceRoom={
                  (chanceRooms as Array<`0x${string}`>).at(-1) || ""
                }
              />
            )}
          </div>
          {/* CTA */}
          <div className="grid-cta grid-item-box">5</div>
        </div>
      </div>
      {/* <MainPie /> */}
    </main>
  );
}
