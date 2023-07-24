import Head from "next/head";
import { useEffect, useState } from "react";
import GameData from "~/Components/GameData/GameData";
import { api } from "~/utils/api";

interface RankData {
  rank: number;
  appid: number;
  concurrent_in_game: number;
  peak_in_game: number;
}

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
    let app: RankData | undefined = appListData[ind];

    do {
      ind = Math.floor(Math.random() * appListData.length) - 1;
      app = appListData[ind];
      if (app === undefined) throw new TypeError("app not found");
    } while (
      excludeIds.includes(app.appid) || existingId !== undefined
        ? Math.abs(
            appListData.findIndex((value) => {
              value.appid === existingId;
            }) - ind
          ) > maxSeparation
        : false
    );

    return appListData[ind]?.appid;
  }

  const appListQuery = api.steam.getTopList.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
  // prettier-ignore
  const appListData: RankData[] = (appListQuery.data as {response: {ranks: RankData[]}})?.response?.ranks;
  const [appids, setAppids] = useState<number[]>([]);

  useEffect(() => {
    if (appListData === undefined) return;
    const id1 = PickRandomId({});
    const id2 = PickRandomId({ existingId: id1 });
    if (id1 === undefined || id2 === undefined) return;
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
