import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { uploadSingleBannerImage } from "../middleware/banner.middleware.js";
import {
  createAdminBannerService,
  deleteAdminBannerService,
  fetchAdminBanners,
} from "../services/admin.banner.service.js";

export const adminBannerRouter = Router();

adminBannerRouter.use(authenticate, requireAdmin);

adminBannerRouter.post("/", uploadSingleBannerImage, async (req, res, next) => {
  try {
    const banner = await createAdminBannerService(req.file);

    res.status(201).json({
      success: true,
      data: { banner },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

adminBannerRouter.get("/", async (req, resizeBy, next) => {
  try {
    const banners = await fetchAdminBanners();

    resizeBy.status(200).json({
      success: true,
      data: { banners },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

adminBannerRouter.delete("/:bannerId", async (req, res, next) => {
  try {
    await deleteAdminBannerService(req.params.bannerId);

    res.status(200).json({
      success: true,
      message: "banner deleted successfully",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
