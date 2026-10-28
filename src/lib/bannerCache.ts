import {
  ADMIN_BANNERS_CACHE_KEY,
  ADMIN_BANNERS_CACHE_TTL_SECONDS,
} from "../consts/consts.js";
import { Banner } from "../types/banner.js";
import { redis } from "./redis.js";

export async function getBannersFromCache(): Promise<Banner[] | null> {
  try {
    const cacheData = await redis.get(ADMIN_BANNERS_CACHE_KEY);
    if (!cacheData) return null;

    return JSON.parse(cacheData) as Banner[];
  } catch (error) {
    console.error("[Redis Cache Error] getBannersFromCache failed:", error);
    return null;
  }
}

export async function setBannerCache(banners: Banner[]): Promise<void> {
  try {
    await redis.set(
      ADMIN_BANNERS_CACHE_KEY,
      JSON.stringify(banners),
      "EX",
      ADMIN_BANNERS_CACHE_TTL_SECONDS,
    );
  } catch (error) {
    console.error("[Redis Cache Error] setBannerCache failed:");
  }
}

export async function clearBannersCache(): Promise<void> {
  try {
    await redis.del(ADMIN_BANNERS_CACHE_KEY);
  } catch (error) {
    console.error("[Redis Cache Error] clearBannersCache failed:", error);
  }
}
