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
      <div className="flex w-[110%] flex-col rounded-lg bg-slate-500/50">
        <div className="flex place-content-center">
          <p className="text-3xl text-white">
            {gameDataQuery.data
              ? gameDataQuery.data?.name
              : "Loading tRPC query..."}
          </p>{" "}
        </div>
        <div className="h-2"></div>
        <Image
          className="rounded-lg"
          src={gameDataQuery?.data?.image ?? ""}
          alt={""}
          width={500}
          height={250}
        />
        <div className="h-4"></div>
        <div className="flex place-content-center">
          <button className="h-12 w-[30%] rounded-lg bg-zinc-200">
            <p className="text-slate-800">Select</p>
          </button>
        </div>
        {
          //   <p className="text-2xl text-white">
          //   {gameDataQuery
          //     ? gameDataQuery.data?.playerCount
          //     : "Loading tRPC query..."}
          // </p>
        }
      </div>
    </>
  );
}
