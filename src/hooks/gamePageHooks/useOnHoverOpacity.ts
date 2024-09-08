import { COLORS } from "@/constants";
import { stringToColour } from "@/lib/generateColorFromAddress";
import { setSpinnerActiveIndex } from "@/redux/spinner/spinnerSlice";
import { AppDispatch, RootState } from "@/redux/stores/store";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import tinycolor from "tinycolor2";

export const useOnHoverOpacity = () => {
  // const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const SpinnerActiveIndex = useSelector((state: RootState) => state?.spinner.spinnerActiveIndex);

  const dispatch = useDispatch<AppDispatch>();

  const handleMouseEnter = useCallback((_data: any, index: any) => {
    // setActiveIndex(index);
    dispatch(setSpinnerActiveIndex(index))
  }, []);
  const handleMouseLeave = useCallback(() => {
    // setActiveIndex(undefined);
    dispatch(setSpinnerActiveIndex(undefined))
  }, []);

  const getFillColor = (index: number) => {
    const color = COLORS[index % COLORS.length];

    if (SpinnerActiveIndex === undefined || SpinnerActiveIndex === index) {
      return color;
    }

    return tinycolor(color).setAlpha(0.2);
  };
  const getFillAddressColor = (address: string, index:number) => {
    const color = stringToColour(address)

    if (SpinnerActiveIndex === undefined || SpinnerActiveIndex === index) {
      return color;
    }

    return tinycolor(color).setAlpha(0.2);
  };



  return {
    // setActiveIndex,
    getFillColor,
    handleMouseEnter,
    handleMouseLeave,getFillAddressColor
    // activeIndex,
  };
};
