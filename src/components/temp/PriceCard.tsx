import React from "react";
import Polygon from "@/../public/assets/svgs/polygon.svg";
import Image from "next/image";

const PriceCard = () => {
  return (
    <div className="px-1 my-1 justify-between items-center flex flex-row">
      <div className="flex flex-row gap-x-2">
        <Image alt="polygon" height={28} width={28} src={Polygon} />
        <div className="flex flex-col gap-y-px">
          <span className="font-semibold text-white tracking-tight text-sm">
            MATIC
          </span>
          <span className="text-slate-200 tracking-tighter text-sm">
            $0.4189
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-y-px items-end">
        <span className="font-semibold text-white tracking-tight text-sm">
          0
        </span>
        <span className="text-slate-200 tracking-tighter text-sm">$0.00</span>
      </div>
    </div>
  );
};

export default PriceCard;
