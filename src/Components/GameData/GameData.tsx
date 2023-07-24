import { ReactNode, useEffect, useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import { GameDataType } from "~/server/api/routers/steam";

export default function GameData({
  appid,
  onSelect,
  PassDataUp,
  id,
  children,
}: {
  appid: number;
  onSelect?: (arg0: number) => unknown;
  PassDataUp?: (arg0: number, arg1: number) => void;
  id: number;
  children?: ReactNode | string;
}) {
  function updateGame(appid: number) {
    setInputText(appid.toString());
    //setAppid(appid);
  }

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

  useEffect(() => {
    if (gameDataQuery?.data === undefined) return;
    PassDataUp?.(gameDataQuery.data.playerCount, id);
  }, [gameDataQuery.data]);

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
            <p
              className="font-semibold text-slate-800"
              onClick={() => {
                gameDataQuery.data ? onSelect?.(id) : null;
              }}
            >
              Select
            </p>
          </button>
        </div>
        <p className="text-2xl text-white">{children}</p>
        <div className="h-4"></div>
      </div>
    </>
  );
}
