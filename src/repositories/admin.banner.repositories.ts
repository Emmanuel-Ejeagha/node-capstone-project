import { AppError } from "../errors/AppError.js";
import { pool } from "../lib/db.js";
import { Banner } from "../types/banner.js";

type BannerRow = Banner;

export async function createAdminBanner(
  imageUrl: string,
  cloudinaryPublicId: string,
): Promise<Banner> {
  const result = await pool.query<BannerRow>(
    `
    INSERT INTO banners (image_url, cloudinary_public_id)
    VALUES($1, $2 )
    RETURNING id, image_url, cloudinary_public_id, updated_at
    `,
    [imageUrl, cloudinaryPublicId],
  );

  const banner = result.rows[0];

  if (!banner)
    throw new AppError(500, "An error occurred while creating banner");

  return banner;
}
