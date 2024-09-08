"use client";
import React from "react";

import dynamic from "next/dynamic";

const WidgetBot = dynamic(() => import("@widgetbot/react-embed"), {
  ssr: false,
});

const DiscordWidget = () => {
  return (
    <div className="hidden !max-w-[500px]">
      <WidgetBot
        server="1156659327147442346"
        className="absolute w-[20%] right-0 bottom-0 min-h-[700px]"
        channel="1156659327147442349"
        height={700}
        // width={"20%"}
      />
    </div>
  );
};

export default DiscordWidget;
