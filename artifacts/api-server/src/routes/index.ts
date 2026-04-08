import { Router, type IRouter } from "express";
import healthRouter from "./health";
import artistsRouter from "./artists";
import packagesRouter from "./packages";
import inquiriesRouter from "./inquiries";
import eventsRouter from "./events";
import rigsRouter from "./rigs";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(artistsRouter);
router.use(packagesRouter);
router.use(inquiriesRouter);
router.use(eventsRouter);
router.use(rigsRouter);
router.use(adminRouter);

export default router;
