import express from 'express';
import { coursesController } from '../controllers/courses.controller.js';

const router = express.Router();

/**
 * GET /api/v1/lessons/:id
 * Get lesson details with full content
 */
router.get('/:id', coursesController.getLessonDetails);

export default router;

