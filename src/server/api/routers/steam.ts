import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export type GameDataType = {
  name: string;
  playerCount: number;
  image: string;
}

export const steamRouter = createTRPCRouter({
  getPlayerStats: publicProcedure
    .input(z.object({ appid: z.number()}))
    .query(async ({ input }) => {
        const data = {} as any;
        [data.gameInfo, data.playerCount] = await Promise.all([fetch(`http://store.steampowered.com/api/appdetails/?appids=${input.appid}&filters=basic`), fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${input.appid}`)]);
        [data.gameInfo, data.playerCount] = await Promise.all([data.gameInfo.json(), data.playerCount.json()]);
        return {
        name: data.gameInfo[input.appid].data.name,
        playerCount: data.playerCount.response.player_count,
        image: data.gameInfo[input.appid].data.header_image,
      } as GameDataType;
    }),
    getStatsProtected: protectedProcedure.input(z.object({ appid: z.number()})).query(async ({ input }) => {
      const data = {} as any;
      [data.gameInfo, data.playerCount] = await Promise.all([fetch(`http://store.steampowered.com/api/appdetails/?appids=${input.appid}&filters=basic`), fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${input.appid}`)]);
      [data.gameInfo, data.playerCount] = await Promise.all([data.gameInfo.json(), data.playerCount.json()]);
      return {
      name: data.gameInfo[input.appid].data.name,
      playerCount: data.playerCount.response.player_count,
      image: data.gameInfo[input.appid].data.header_image,
    };
  }),
  getTopList: publicProcedure.query(async () => {
    const data = await (await fetch("https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/")).json();
    return data;
  })
});
