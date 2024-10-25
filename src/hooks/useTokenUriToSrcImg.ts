
import { Buffer } from "buffer";

import { RefObject, useCallback, useEffect, useState } from "react";

type Event = MouseEvent | TouchEvent;

export const useTokenUriToSrcImg = <T extends HTMLElement = HTMLElement>(
  isSuccess: boolean,
  TokenUri: string | undefined,
) => {
    const [imageSrc, setImageSrc] = useState<null | string>(null);

    const parseTokenURI = useCallback((result: string | null): string | null => {
    try {
      const parsed = result ? JSON.parse(result) : null;
      if (parsed && typeof parsed === "object" && "image" in parsed) {
        return parsed.image;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, []);


    useEffect(() => {
    if (isSuccess && TokenUri && TokenUri.slice(29)) {
      try {
        let parsed = Buffer.from(TokenUri.slice(29).toString(), "base64");
        //@ts-ignore
        const nice1 = parseTokenURI(parsed);
        setImageSrc(nice1);
      } catch (error) {
      }
    }
  }, [isSuccess, TokenUri]);

  return {imageSrc}
};
