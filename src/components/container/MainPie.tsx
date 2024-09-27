"use client";
import {
  ArrowRightToLine,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";
import { Cell, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Buffer } from "buffer";

import { motion } from "framer-motion";

import { RoomAbi } from "@/assets/abi/mainAbi";
import {
  Card as CardContainer,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useOnHoverOpacity } from "@/hooks/gamePageHooks/useOnHoverOpacity";
import { useUnderMobileWindow } from "@/hooks/useUnderMobileWindow";
import { stringToColour } from "@/lib/generateColorFromAddress";
import { cn } from "@/lib/utils";
import { setChanceRoomStatus } from "@/redux/spinner/spinnerSlice";
import { AppDispatch, RootState } from "@/redux/stores/store";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { polygon } from "viem/chains";
import { useReadContract } from "wagmi";
import { buttonVariants } from "../ui/button";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#00C49F"];
export const description = "A donut chart with an active sector";
const chartData = [
  { name: "chrome", value: 200 },
  { name: "safari", value: 9000000000 },
  { name: "firefox", value: 9000000000 },
  { name: "edge", value: 9000000000 },
  { name: "other", value: 9000000000 },
];
const chartConfig = {
  chrome: {
    label: "Chrome11",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "#2a2a",
  },
} satisfies ChartConfig;

interface MainPieProps {
  chanceRoomAddress: `0x${string}`;
}

export default function MainPie({ chanceRoomAddress }: MainPieProps) {
  const { isMobile } = useUnderMobileWindow();
  let myPidata: { name: string; value: number }[] = [];
  let mychartConfig: ChartConfig = {};

  const {
    spinnerActiveIndex: SpinnerActiveIndex,
    pieData,
    chanceRoomStatus,
  } = useSelector((state: RootState) => state?.spinner);

  const dispatch = useDispatch<AppDispatch>();

  const {
    // activeIndex,
    getFillColor,
    handleMouseEnter,
    getFillAddressColor,
    handleMouseLeave,
    // setActiveIndex,
  } = useOnHoverOpacity();

  const {
    data: StautsData,
    isLoading: isSatusLoading,
    isError: StatusError,
    isSuccess: statusSuccess,
  } = useReadContract({
    address: chanceRoomAddress,
    abi: RoomAbi,
    functionName: "status",
  });

  const {
    data: TokenUri,
    isError,
    isLoading,
    isSuccess,
  } = useReadContract({
    address: chanceRoomAddress,
    abi: RoomAbi,
    functionName: "tokenURI",
    args: [BigInt(0)],
    chainId: polygon.id,
  });

  useEffect(() => {
    if (statusSuccess) {
      //@ts-ignore
      dispatch(setChanceRoomStatus(StautsData));
    }
  }, [statusSuccess, StautsData, dispatch]);

  const parseTokenURI = useCallback((result: string | null): string | null => {
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
    if (isSuccess) {
      //@ts-ignore
      // let parsed = atob(TokenUri?.slice(29).toString());
      let parsed2 = Buffer.from(TokenUri?.slice(29).toString(), "base64");
      //@ts-ignore
      // console.log(JSON.parse(parsed2).image, "p22222");
      //@ts-ignore
      return parseTokenURI(parsed2);

      // return parseTokenURI(parsed);
    }
  }, [isSuccess]);

  if (pieData.length !== 0) {
    pieData.map((data, i) => {
      if (data.value !== 0) {
        myPidata.push({ name: data.name, value: data.value });
        mychartConfig[data.name] = {
          label: data.name.slice(2, 8),
          color: stringToColour(data.name),
        };
      }
    });
  }

  useEffect(() => {
    if (pieData.length !== 0) {
      pieData.forEach((data, i) => {
        if (data.value !== 0) {
          myPidata.push({ name: data.name, value: data.value });
          mychartConfig[data.name] = {
            label: data.name.slice(2, 8),
            color: stringToColour(data.name),
          };
        }
      });
    }
  }, [pieData]);

  if (isSuccess) {
  }

  if (StatusError || isError) {
    return <div className="h-[58vh] text-slate-200  "></div>;
  }

  if (isLoading) {
    return <div className="h-[58vh] text-slate-200  "></div>;
  }

  return (
    <CardContainer className="flex flex-col w-full bg-transparent h-full border-none">
      <CardHeader className="items-center !h-10 flex mt-2 max-sm:!px-1 ">
        <div className="flex justify-between h-full items-center flex-row w-full text-slate-100">
          <h1
            className="font-handjet sm:tracking-wide font-semibold text-lg"
            // onClick={() => setActiveIndex(2)}
          >
            ChanceRoom_Sang
          </h1>
          <div className="flex flow-row sm:gap-x-3 gap-x-1 font-sans">
            <Link
              href={""}
              target="_blank"
              className={buttonVariants({
                variant: "secondary",
                className:
                  "bg-transparent sm:w-[90px] w-[34px] h-[35px] flex flex-row gap-x-1  !p-0 border text-slate-100 border-neutral-700 hover:!bg-slate-800 transition-all duration-300 rounded-2xl",
              })}
            >
              <History size={20} />{" "}
              <span className="text-[14px] max-sm:hidden">History</span>
            </Link>
            <Link
              href={""}
              target="_blank"
              className={buttonVariants({
                variant: "secondary",
                className:
                  "bg-transparent w-[33px] h-[35px] !p-0 border text-slate-100 border-neutral-700 hover:!bg-slate-800 transition-all duration-300 rounded-2xl",
              })}
            >
              <ChevronLeft size={25} />
            </Link>
            <Link
              href={""}
              target="_blank"
              className={buttonVariants({
                variant: "secondary",
                className:
                  "bg-transparent w-[33px] h-[35px] !p-0 border text-slate-100 border-neutral-700 hover:!bg-slate-800 transition-all duration-300 rounded-2xl",
              })}
            >
              <ChevronRight size={25} />
            </Link>
            <Link
              href={""}
              target="_blank"
              className={buttonVariants({
                variant: "secondary",
                className:
                  "bg-transparent w-[33px] h-[35px] !p-0 border text-slate-100 border-neutral-700 hover:!bg-slate-800 transition-all duration-300 rounded-2xl",
              })}
            >
              <ArrowRightToLine size={25} />
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0 !h-full !p-0 relative ">
        <div className="absolute flex justify-between ms:px-6 px-3 bottom-3 w-full z-30 text-slate-200 font-semibold text-lg">
          {isSatusLoading ? (
            ""
          ) : (
            <>
              <span>{chanceRoomStatus?.at(0)}</span>
              <span>{chanceRoomStatus?.at(1)}</span>
            </>
          )}
        </div>
        <div className="relative  ">
          {/* {winnerSelected && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 2 }}
              transition={{ duration: 1, ease: "easeOut", bounce: 0.25 }}
              className="absolute z-10 text-white bottom-20"
            >
              <p className="underline">Winner is : {winnerSelected}</p>
            </motion.div>
          )} */}

          {pieData.length === 0 ||
          myPidata.length === 0 ||
          Object.keys(mychartConfig).length === 0 ? (
            <div className="text-white  !h-[53vh]"></div>
          ) : (
            <div className="relative border-[0.9rem] flex justify-center border-slate-200 p-1 rounded-full  max-w-[490px]  mx-auto max-sm:scale-75 ">
              <Image
                src={"./assets/svgs/stopper.svg"}
                width={45}
                height={45}
                className={cn("absolute -top-[10px] z-30 rotate-[90deg]", {
                  hidden: SpinnerActiveIndex !== undefined,
                })}
                alt="stopper"
              />
              <motion.div className=" w-full h-full relative">
                <div
                  className="absolute opacity-85 w-full -z-10 flex justify-center items-center sm:h-[450px] max-[500px]:h-[376px] h-[55vh]
                 max-[430px]:h-[370px] max-[400px]:h-[290px] "
                >
                  {nice1 && (
                    <img
                      src={nice1 || ""}
                      alt="Main Image"
                      width={350}
                      height={350}
                      className="rounded-full mx-auto translate-y-1 z-0 transition-all duration-500 ease-out"
                      style={{
                        opacity: SpinnerActiveIndex === undefined ? 0.9 : 0,
                      }}
                    />
                  )}
                </div>

                <ChartContainer
                  config={mychartConfig}
                  className="mx-auto aspect-square max-h-[490px] -rotate-90"
                >
                  <PieChart className="scale-[1.28]">
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={myPidata}
                      dataKey="value"
                      nameKey="name"
                      className=""
                      innerRadius={!isMobile ? 135 : 100}
                      strokeWidth={5}
                      activeIndex={undefined}
                      style={{}}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      isAnimationActive={false}
                      activeShape={({
                        outerRadius = 0,
                        ...props
                      }: PieSectorDataItem) => (
                        <Sector {...props} outerRadius={outerRadius + 15} />
                      )}
                    >
                      {myPidata.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            getFillAddressColor(entry.name, index) as string
                          }
                          style={{
                            transition: "fill .3s ease-in-out ",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </motion.div>
            </div>
          )}
        </div>
      </CardContent>
    </CardContainer>
  );
}
