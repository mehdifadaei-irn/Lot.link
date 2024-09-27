"use client";
import { RoomAbi } from "@/assets/abi/mainAbi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Minus, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { formatEther } from "viem";
import { polygon } from "viem/chains";
import {
  type BaseError,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

interface DialogProps {
  chanceRoomAddress: `0x${string}`;
  disabled: boolean;
}

const CTADialog = ({ chanceRoomAddress, disabled = false }: DialogProps) => {
  const [amount, setAmount] = useState<number>(0);

  const {
    data: contractDataLayout,
    isLoading: isLayoutLoading,
    isSuccess: layoutSuccess,
    isError,
    refetch,
    queryKey,
  } = useReadContract({
    address: chanceRoomAddress,
    abi: RoomAbi,
    functionName: "layout",
    chainId: polygon.id,
  });

  const QueryClient = useQueryClient();
  const {
    data: hash,
    writeContract,
    isPending,
    error,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("writed");
        QueryClient.invalidateQueries({
          queryKey: [
            "getEvents",
            `${chanceRoomAddress}`,
            "readContract",
            { chainId: 137 },
          ],
        });
      },
    },
  });

  const MaxTickets = useMemo(() => {
    //@ts-ignore
    return parseInt(contractDataLayout?.Uint256?.maximumTicket);
  }, [contractDataLayout]);

  const SoldTickets = useMemo(() => {
    //@ts-ignore
    return parseInt(contractDataLayout?.Uint256?.soldTickets);
  }, [contractDataLayout]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  function handleMint() {
    if (amount > 0) {
      writeContract({
        address: chanceRoomAddress,
        abi: RoomAbi,
        functionName: "purchaseBatchTicket",
        args: [BigInt(amount)],
        chainId: polygon.id,
        value: BigInt(amount * 10 ** 18),
      });
    } else {
      toast.error("you must buy at least 1 ticket!");
    }
  }

  if (isError) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Enter Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-slate-200 ">
        <DialogHeader>
          <DialogTitle>Enter To ChanceRoom</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            quod.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <div className="flex flex-row justify-between items-center">
            <div className="flex gap-x-2">
              <div className="flex items-center border border-slate-700 rounded-lg h-11">
                <Button
                  variant={"outline"}
                  className="w-11 border-none !p-0 !rounded-l-lg !rounded-r-none mr-1"
                  onClick={() => {
                    if (amount !== 0) {
                      setAmount((prev) => prev - 1);
                    } else {
                      return;
                    }
                  }}
                >
                  <Minus />
                </Button>
                <input
                  value={amount}
                  onChange={(e) => {
                    if (e.target.value == ".") {
                      return;
                    } else {
                      //@ts-ignore
                      if (isNaN(e.target.value)) return;
                      //@ts-ignore
                      else setAmount(parseInt(e.target.value) as number);
                    }
                  }}
                  className="w-12 h-[90%] bg-transparent flex items-center justify-center text-center "
                  type="number"
                  placeholder="0"
                />
                <Button
                  variant={"outline"}
                  className="w-11 border-none !p-0 !rounded-r-lg !rounded-l-none ml-1"
                  onClick={() => {
                    if (amount >= 0) {
                      if (amount < MaxTickets) {
                        setAmount((prev: number) => prev + 1);
                      }
                    } else {
                      return;
                    }
                  }}
                >
                  <Plus />
                </Button>
              </div>
              <Button
                variant={"secondary"}
                disabled={MaxTickets === SoldTickets}
                className="w-14 border-none !p-0 ml-1"
                onClick={() => {
                  setAmount(MaxTickets - SoldTickets);
                }}
              >
                Max
              </Button>
            </div>
            <Button disabled={isPending} onClick={handleMint}>
              {isPending ? "Confirming..." : "Mint"}
            </Button>
          </div>
          <div className="w-full flex flex-col gap-y-2 min-h-14 items-center justify-center">
            {isConfirming && (
              <p className="flex mx-auto text-center  text-lime-500 font-medium">
                Waiting for confirmation...{" "}
                <Loader2 className=" w-6 h-6 ml-1 animate-spin" />
              </p>
            )}
            {isConfirmed && (
              <p className="flex mx-auto text-center text-slate-200 font-medium">
                Transaction confirmed.
              </p>
            )}
            {error && (
              <div className=" text-center text-red-500">
                Error: {(error as BaseError).shortMessage || error.message}
              </div>
            )}
            {MaxTickets === SoldTickets ? (
              <p className="w-full text-center  text-red-500 font-medium">
                no more ticket left
              </p>
            ) : null}
          </div>
        </div>
      </DialogContent>

      {/* <p className="font-handjet font-bold text-start text-[16px] text-slate-200 flex items-center">
              How to{" "}
              <CircleHelp
                color="#333"
                size={18}
                className="ml-1 cursor-pointer"
              />
            </p> */}
    </Dialog>
  );
};

export default CTADialog;
