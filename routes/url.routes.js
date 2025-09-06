import express from 'express'
import "dotenv/config";
import { urlShortnerController,shortCodeTarget,getAllCodes,deleteShortCode,updateShortCode} from '../controllers/url.controllers.js';
import {ensureAuthenticated} from '../middleware/auth.middleware.js'


const router=express.Router();

router.post('/shorten',ensureAuthenticated,urlShortnerController);
router.get('/codes',ensureAuthenticated,getAllCodes);
router.patch('/update',ensureAuthenticated,updateShortCode);
router.delete('/:code',ensureAuthenticated,deleteShortCode);
router.get('/:shortcode',shortCodeTarget);

export default router;

