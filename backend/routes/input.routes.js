import { Router } from 'express';
import { acceptCourseInput } from '../controllers/input.controller.js';

const router = Router();

/**
 * POST /api/v1/courses/input
 * Accept course input from Content Studio (trainer-driven)
 */
router.post('/courses/input', acceptCourseInput);

/**
 * POST /api/v1/ai/trigger-personalized-course
 * Learner AI trigger for personalized course generation
 */
router.post('/ai/trigger-personalized-course', acceptCourseInput);

export default router;


