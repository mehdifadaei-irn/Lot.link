import React from "react";
import DiscordIcon from "@/../public/assets/svgs/discord.svg";
import TwitterIcon from "@/../public/assets/svgs/Twitter.svg";
import LottLogo from "@/../public/assets/imgs/lottLogo.jpg";
import Link from "next/link";
import { CircleHelp, Rabbit } from "lucide-react";
import Image from "next/image";
import { buttonVariants } from "../ui/button";

const SideBar = () => {
  return (
    <aside className="w-20 bg-background  border-r border-neutral-700 font-sans md:block hidden fixed h-screen">
      <div className="flex flex-col justify-between items-center h-full pt-5 pb-7">
        <div>
          <Link href={"/"}>
            <Image
              src={LottLogo.src}
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
              alt="logo"
            />
          </Link>
        </div>
        <div className="flex flex-col gap-y-8 items-center ">
          <div className="flex flex-col gap-y-4 items-center">
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

          <div className="w-full">
            <Link
              href={""}
              className={buttonVariants({
                variant: "ghost",
                className:
                  "flex flex-col items-center text-slate-400 text-xs gap-y-1 transition-all duration-300 !p-0 w-16 h-12 hover:!bg-slate-400/80 hover:!text-slate-300 ",
              })}
            >
              <CircleHelp color="#fff" className="h-6 w-6" />
              Docs
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
