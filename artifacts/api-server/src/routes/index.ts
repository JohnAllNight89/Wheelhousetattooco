import { Router, type IRouter } from "express";
import healthRouter from "./health";
import artistsRouter from "./artists";
import servicesRouter from "./services";
import customersRouter from "./customers";
import bookingsRouter from "./bookings";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(artistsRouter);
router.use(servicesRouter);
router.use(customersRouter);
router.use(bookingsRouter);
router.use(dashboardRouter);

export default router;
