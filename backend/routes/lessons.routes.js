import express from 'express';
import { coursesController } from '../controllers/courses.controller.js';

const router = express.Router();

/**
 * GET /api/v1/lessons/:id/exercises
 * Get exercises HTML for a lesson (AJAX endpoint)
 */
router.get('/:id/exercises', coursesController.getLessonExercises);

/**
 * GET /api/v1/lessons/:id
 * Get lesson details with full content
 */
router.get('/:id', coursesController.getLessonDetails);

export default router;

