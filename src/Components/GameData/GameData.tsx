import { useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";

export default function GameData({ appid }: { appid: number }) {
  function updateGame(appid: number) {
    setInputText(appid.toString());
    //setAppid(appid);
  }

  //const [appid, setAppid] = useState(730);
  const [inputText, setInputText] = useState(appid.toString());
  const gameDataQuery = api.steam.getPlayerStats.useQuery(
    {
      appid: appid,
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );

  return (
    <>
      <div className="flex w-[110%] flex-col bg-slate-500/50">
        <div className="h-8"></div>
        <p className="text-2xl text-white">
          {gameDataQuery.data
            ? gameDataQuery.data?.name
            : "Loading tRPC query..."}
        </p>
        <Image
          className="rounded-lg"
          src={gameDataQuery?.data?.image ?? ""}
          alt={""}
        />
        <div className="h-8"></div>
        <p className="text-2xl text-white">
          {gameDataQuery
            ? gameDataQuery.data?.playerCount
            : "Loading tRPC query..."}
        </p>
      </div>
    </>
  );
}
