import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export interface GameDataType {
  name: string;
  playerCount: number;
  image: string;
}

interface GameInfo {
  data: {
    name: string;
    header_image: string;
  }
}

interface PlayerCount {
  response: {
    player_count: number;
  }
}

type GameInfoJSON = Record<string, GameInfo>;

export const steamRouter = createTRPCRouter({
  getPlayerStats: publicProcedure
    .input(z.object({ appid: z.number()}))
    .query(async ({ input }) => {
        const [gameInfoRaw, playerCountRaw] = await Promise.all([fetch(`http://store.steampowered.com/api/appdetails/?appids=${input.appid}&filters=basic`), fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${input.appid}`)]);
        const [gameInfo, playerCount]: [GameInfoJSON, PlayerCount] = (await Promise.all([gameInfoRaw.json(), playerCountRaw.json()])) as [GameInfoJSON, PlayerCount];
        return {
        name: gameInfo[input.appid]?.data.name,
        playerCount: playerCount.response.player_count,
        image: gameInfo[input.appid]?.data.header_image,
      } as GameDataType;
    }),
  //   getStatsProtected: protectedProcedure.input(z.object({ appid: z.number()})).query(async ({ input }) => {
  //     const data = {} as any;
  //     [data.gameInfo, data.playerCount] = await Promise.all([fetch(`http://store.steampowered.com/api/appdetails/?appids=${input.appid}&filters=basic`), fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${input.appid}`)]);
  //     [data.gameInfo, data.playerCount] = await Promise.all([data.gameInfo.json(), data.playerCount.json()]);
  //     return {
  //     name: data.gameInfo[input.appid].data.name,
  //     playerCount: data.playerCount.response.player_count,
  //     image: data.gameInfo[input.appid].data.header_image,
  //   };
  // }),
  getTopList: publicProcedure.query(async () => {
    const data: TopListData = (await (await fetch("https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/")).json()) as TopListData;
    return data;
  })
});

interface TopListData {
  response: {
    ranks: object;
  }
}