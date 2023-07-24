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

    let ind = Math.floor(Math.random() * appListData.length);
    let app: RankData | undefined = appListData[ind];

    do {
      ind = Math.floor(Math.random() * appListData.length) - 1;
      app = appListData[ind];
      if (app === undefined) {
        console.log(`${app}`);
        throw new TypeError("app not found");
      }
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

  function ReceiveData(playerCount: number, id: number) {
    const newGameData = gameData;
    newGameData[id] = playerCount;
    setGameData(newGameData);
  }

  function HandleSelect(id: number) {
    setSelected(true);
    if (gameData.indexOf(Math.max(...gameData)) === id) {
      setResult(true);
    } else {
      setResult(false);
    }
  }

  function Reset() {
    PickIDs();
    setGameData([]);
    setSelected(false);
    setResult(false);
  }

  function PickIDs() {
    const id1 = PickRandomId({});
    const id2 = PickRandomId({ existingId: id1 });
    if (id1 === undefined || id2 === undefined) return;
    setAppids([id1, id2]);
  }

  const appListQuery = api.steam.getTopList.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  // prettier-ignore
  const appListData: RankData[] = (appListQuery.data as {response: {ranks: RankData[]}})?.response?.ranks;
  const [appids, setAppids] = useState<number[]>([]);
  const [gameData, setGameData] = useState<number[]>([]);
  const [selected, setSelected] = useState<boolean>(false);
  const [result, setResult] = useState<boolean>(false);
  useEffect(() => {
    if (appListData === undefined) return;
    PickIDs();
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
            {!selected ? (
              <>
                Player <span className="text-[hsl(280,100%,70%)]">Count</span>{" "}
                Guesser
              </>
            ) : result ? (
              "Correct"
            ) : (
              "Wrong"
            )}
          </h1>

          <div className="flex flex-row items-center justify-center">
            {appids[0] && appListData ? (
              <>
                <GameData
                  appid={appids[0]}
                  id={0}
                  PassDataUp={ReceiveData}
                  onSelect={HandleSelect}
                >
                  {selected ? gameData[0] : null}
                </GameData>
              </>
            ) : null}
            <div className="p-8 text-5xl text-slate-100">vs</div>
            {appids[1] && appListData ? (
              <>
                <GameData
                  appid={appids[1]}
                  id={1}
                  PassDataUp={ReceiveData}
                  onSelect={HandleSelect}
                >
                  {selected ? gameData[1] : null}
                </GameData>
              </>
            ) : null}
          </div>
          {selected ? (
            <button className="h-20 w-[10%] rounded-lg bg-zinc-200">
              <p className="font-semibold text-slate-800" onClick={Reset}>
                Again?
              </p>
            </button>
          ) : null}
        </div>
      </main>
    </>
  );
}
