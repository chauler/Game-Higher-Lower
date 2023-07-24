import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import GameData from "~/Components/GameData/GameData";
import { GameDataType } from "~/server/api/routers/steam";
import { api } from "~/utils/api";

export default function Home() {
  function PickRandomId({
    excludeIds = [],
    maxSeparation = 100,
    existingId,
  }: {
    excludeIds?: number[];
    maxSeparation?: number;
    existingId?: number | undefined;
  }) {
    if (!appListData) return;

    let ind = Math.floor(Math.random() * appListData.length) - 1;
    while (
      excludeIds.includes(appListData[ind].appid) || existingId !== undefined
        ? Math.abs(appListData.indexOf(existingId) - ind) > maxSeparation
        : false
    ) {
      ind = Math.floor(Math.random() * appListData.length) - 1;
    }
    return appListData[ind].appid;
  }

  const appListQuery = api.steam.getTopList.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
  const appListData = appListQuery.data?.response?.ranks;
  const [appids, setAppids] = useState<number[]>([]);

  useEffect(() => {
    if (appListData === undefined) return;
    let id1 = PickRandomId({});
    let id2 = PickRandomId({ existingId: id1 });
    setAppids([id1, id2]);
  }, [appListData]);

  return (
    <>
      <Head>
        <title>Player Count Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Player <span className="text-[hsl(280,100%,70%)]">Count</span>{" "}
            Guesser
          </h1>

          <button></button>

          <div className="flex flex-row items-center justify-center">
            {appids[0] && appListData ? (
              <GameData appid={appids[0]}></GameData>
            ) : null}
            <div className="p-8 text-5xl text-slate-100">vs</div>
            {appids[1] && appListData ? (
              <GameData appid={appids[1]}></GameData>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}
