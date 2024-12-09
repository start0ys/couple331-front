import express from "express";
import main from "./view/view.js"
import user from "./api/user.js"
import auth from "./api/auth.js"
import couple from "./api/couple.js"
import schedule from "./api/schedule.js"
import board from "./api/board.js"

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.use('/', main);
router.use('/api/users', user);
router.use('/api/auth', auth);
router.use('/api/couple', couple);
router.use('/api', schedule);
router.use('/api/board', board);

export default router;
