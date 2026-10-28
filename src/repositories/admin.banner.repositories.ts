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

export async function findAllAdminBannersFromDB(): Promise<Banner[]> {
  const result = await pool.query<BannerRow>(`
    SELECT id, image_url, cloudinary_public_id, created_at, updated_at
    FROM banners
    ORDER BY created_at DESC
    `);

  return result.rows;
}

export async function deleteAdminBannerById(bannerId: string): Promise<string> {
  const result = await pool.query<{ cloudinary_public_id: string }>(
    `
      DELETE FROM banners
      WHERE id = $1
      RETURNING cloudinary_public_id
    `,
    [bannerId],
  );

  const banner = result.rows[0];

  if (!banner) {
    throw new AppError(404, "Banner not found");
  }

  if (!banner.cloudinary_public_id) {
    throw new AppError(500, "Banner has no Cloudinary public ID");
  }

  return banner.cloudinary_public_id;
}
