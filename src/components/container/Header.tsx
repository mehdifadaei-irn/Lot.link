"use client";

import { ConnectKitButton } from "connectkit";
import { useEffect, useRef, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi";

import LottLogo from "@/../public/assets/imgs/lottLogo.jpg";
import DiscordIcon from "@/../public/assets/svgs/discord.svg";
import Polygon from "@/../public/assets/svgs/polygon.svg";
import TwitterIcon from "@/../public/assets/svgs/Twitter.svg";

import { stringToColour } from "@/lib/generateColorFromAddress";
import { ChartNoAxesGantt, CircleHelp, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import HoverContent from "./HoverContent";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/stores/store";

const Header = () => {
  const [isClient, setIsClient] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const SideBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useOnClickOutside(SideBarRef, () => {
    setOpenMobileMenu(false);
  });

  const { address, isConnected } = useAccount();

  const { data, isError, isLoading, isFetched } = useBalance({
    address: address || "0x0000000000000000000000000000000000000000",
  });

  const spinner = useSelector((state: RootState) => state?.spinner.value);

  const dispatch = useDispatch<AppDispatch>();

  if (!isClient) {
    return (
      <header className="fixed border-b border-1 2xl:w-[95%] md:w-[90%] w-[99%] h-16 border-neutral-700">
        <div className="flex flex-row pr-6 pl-7 justify-between items-center h-full">
          <h2 className="text-neutral-200 font-handjet font-semibold text-3xl tracking-wide">
            Lott.
          </h2>
          <div className="flex flex-row-reverse items-center gap-x-4">
            <div className=" w-40 h-11 rounded-2xl transition-all animate-pulse overflow-hidden bg-gray-200"></div>
            <div className="w-20 h-11 rounded-2xl transition-all animate-pulse overflow-hidden bg-gray-200"></div>
          </div>
        </div>
      </header>
    );
  }
  if (isLoading && !!address)
    return (
      <header className="fixed border-b border-1 2xl:w-[95%] md:w-[90%] w-[99%] h-16 border-neutral-700">
        <div className="flex flex-row pr-6 pl-7 justify-between items-center h-full">
          <h2 className="text-neutral-200 font-handjet font-bold text-3xl tracking-wide">
            Lott.
          </h2>
          <div className="flex flex-row-reverse items-center gap-x-4">
            <div className=" w-40 h-11 rounded-2xl transition-all animate-pulse overflow-hidden bg-gray-200"></div>
            <div className="w-20 h-11 rounded-2xl transition-all animate-pulse overflow-hidden bg-gray-200"></div>
          </div>
        </div>
      </header>
    );
  // if (isError) return <div>Error fetching balance</div>;
  return (
    <header className="border-b border-1 w-full h-16 border-neutral-700 fixed bg-background z-40 ">
      {/* Mobile Header */}
      <div
        className={`absolute z-20   inset-0 w-screen h-screen ${
          openMobileMenu ? "block" : "hidden"
        }`}
      >
        <div
          ref={SideBarRef}
          className="bg-slate-700 w-[50%]  rounded-r-2xl z-30 h-svh"
        >
          <div className="flex flex-col justify-between px-3 pt-6 pb-5 h-full">
            <div className="flex justify-between items-center">
              <div>
                <Image
                  src={LottLogo.src}
                  className="w-10 h-10 rounded-full  "
                  width={40}
                  height={40}
                  alt="logo"
                />
              </div>
              <Button
                variant={"outline"}
                className="!border-borderColor !px-2 text-slate-300 hover:!text-slate-300 hover:bg-slate-400/20 active:bg-slate-600 duration-300 transition-all"
                onClick={() => setOpenMobileMenu(false)}
              >
                <X />
              </Button>
            </div>
            <div>
              <Link
                href={""}
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "flex flex-col items-start !border-borderColor justify-start text-slate-400 text-xs gap-y-1 transition-all duration-300 !p-0 w-full hover:!bg-slate-400/80 hover:!text-slate-300 ",
                })}
              >
                <div className="flex gap-x-2 justify-start items-center">
                  <CircleHelp color="#fff" className="h-6 w-6" />
                  <span>Docs</span>
                </div>
              </Link>
              <div className="flex justify-center items-center">
                <Link
                  href={"https://x.com/0xlott"}
                  target="_blank"
                  className={buttonVariants({
                    variant: "secondary",
                    className:
                      "bg-transparent w-10 h-10 !p-2.5 border border-neutral-700 hover:!bg-slate-400 transition-all duration-300 rounded-2xl",
                  })}
                >
                  <Image
                    src={TwitterIcon}
                    className="w-20 h-20"
                    width={180}
                    height={180}
                    alt="twitter"
                  />
                </Link>
                <Link
                  href={""}
                  target="_blank"
                  className={buttonVariants({
                    variant: "secondary",
                    className:
                      "bg-transparent w-10 h-10 !p-2.5 border border-neutral-700 hover:!bg-slate-400 transition-all duration-300 rounded-2xl",
                  })}
                >
                  <Image
                    src={DiscordIcon}
                    className="w-20 h-20"
                    width={180}
                    height={180}
                    alt="discord"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Header  */}
      <div className="flex flex-row md:pr-6 pr-3 md:pl-7 pl-4 justify-between items-center h-full 2xl:w-[95%] md:w-[90%] w-[99%]">
        <div className="flex flex-row items-center justify-center">
          <button
            onClick={() => setOpenMobileMenu(true)}
            className="md:hidden flex border hover:bg-slate-400/20 active:bg-slate-600 duration-300 transition-all p-[3px] cursor-pointer mt-2 mr-2 rounded-lg border-borderColor items-center justify-center"
          >
            <ChartNoAxesGantt color="#94a3b8" size={29} />
          </button>
          <h2 className="text-neutral-200 font-handjet font-semibold text-3xl tracking-wide">
            Lott.
          </h2>
        </div>
        <div className="flex flex-row-reverse items-center gap-x-4">
          <div
            className={`border md:block ${
              isConnected ? "hidden" : "block"
            } border-neutral-700 rounded-2xl hover:bg-slate-400/20 duration-300 transition-all`}
          >
            <ConnectKitButton />
          </div>
          <div
            className={`md:hidden ${
              isConnected ? "flex" : "hidden"
            } items-center justify-center h-10 w-10 border border-neutral-700 rounded-lg hover:bg-slate-400/20 duration-300 transition-all`}
          >
            <ConnectKitButton.Custom>
              {({
                isConnected,
                isConnecting,
                show,
                hide,
                address,
                ensName,
                chain,
              }) => {
                return (
                  <button
                    onClick={show}
                    style={{
                      display: isConnected ? "block" : "hidden",
                    }}
                    // className="border border-neutral-700 rounded-2xl hover:bg-slate-400/20 duration-300 transition-all"
                  >
                    {/* {isConnected ? address : "Custom Connect"} */}
                    <div
                      className="w-7 h-7 rounded-full"
                      style={{
                        backgroundColor: stringToColour(address || ""),
                      }}
                    ></div>
                  </button>
                );
              }}
            </ConnectKitButton.Custom>
          </div>

          {isFetched && !isError && isConnected ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="bg-transparent cursor-pointer  !p-2.5 border text-white border-neutral-700 hover:!bg-[#384250] transition-all duration-300 md:rounded-xl rounded-lg">
                  <div className="flex items-center h-5">
                    <p className="font-sans mr-3 font-medium text-base">
                      {(data && formatEther(data.value)?.slice(0, 4)) || ""}{" "}
                    </p>
                    {data?.symbol === "MATIC" ? (
                      <Image
                        height={25}
                        width={25}
                        alt="polygon"
                        src={Polygon}
                      />
                    ) : (
                      data?.symbol
                    )}
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-[21rem] !px-4 bg-[#384250] border border-slate-600 rounded-2xl">
                <HoverContent />
              </HoverCardContent>
            </HoverCard>
          ) : (
            ""
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
