import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Submit feedback for a course
 * Enforces 1-5 rating validation and duplicate learner check
 */
export const submitFeedback = async (courseId, { learner_id, rating, tags, comment }) => {
  try {
    // Validate rating (1-5)
    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      const error = new Error('Rating must be between 1 and 5');
      error.status = 400;
      throw error;
    }

    // Check if course exists
    const course = await db.oneOrNone(
      'SELECT course_id FROM courses WHERE course_id = $1',
      [courseId]
    );

    if (!course) {
      const error = new Error('Course not found');
      error.status = 404;
      throw error;
    }

    // Check if feedback already submitted (one feedback per learner per course)
    const existing = await db.oneOrNone(
      'SELECT feedback_id FROM feedback WHERE course_id = $1 AND learner_id = $2',
      [courseId, learner_id]
    );

    if (existing) {
      const error = new Error('Feedback already submitted for this course');
      error.code = '23505';
      error.status = 409;
      throw error;
    }

    // Create feedback record
    const feedbackId = uuidv4();
    await db.none(
      `INSERT INTO feedback (feedback_id, course_id, learner_id, rating, tags, comment, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [feedbackId, courseId, learner_id, rating, JSON.stringify(tags), comment || '']
    );

    // Update course average rating
    const avgResult = await db.one(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as count
       FROM feedback
       WHERE course_id = $1`,
      [courseId]
    );

    await db.none(
      'UPDATE courses SET average_rating = $1 WHERE course_id = $2',
      [parseFloat(avgResult.avg_rating) || 0, courseId]
    );

    return {
      message: 'Feedback submitted successfully',
      feedback_id: feedbackId,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

/**
 * Get aggregated feedback for a course
 */
export const getAggregatedFeedback = async (courseId) => {
  try {
    // Check if course exists
    const course = await db.oneOrNone(
      'SELECT course_id, course_name FROM courses WHERE course_id = $1',
      [courseId]
    );

    if (!course) {
      return null;
    }

    // Get aggregated stats
    const stats = await db.oneOrNone(
      `SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_ratings
      FROM feedback
      WHERE course_id = $1`,
      [courseId]
    );

    if (!stats || stats.total_ratings === '0') {
      return {
        course_id: courseId,
        average_rating: 0,
        total_ratings: 0,
        tags_breakdown: {},
        recent_comments: []
      };
    }

    // Get tag breakdown
    const tagBreakdown = await db.any(
      `SELECT 
        tag,
        AVG(rating) as avg_rating
      FROM feedback, jsonb_array_elements_text(tags) as tag
      WHERE course_id = $1
      GROUP BY tag`,
      [courseId]
    );

    const tagsBreakdownObj = {};
    tagBreakdown.forEach(item => {
      tagsBreakdownObj[item.tag] = parseFloat(item.avg_rating);
    });

    // Get recent comments (limit 10, anonymized)
    const recentComments = await db.any(
      `SELECT 
        rating,
        comment,
        created_at as timestamp
      FROM feedback
      WHERE course_id = $1 AND comment IS NOT NULL AND comment != ''
      ORDER BY created_at DESC
      LIMIT 10`,
      [courseId]
    );

    return {
      course_id: courseId,
      average_rating: parseFloat(stats.average_rating) || 0,
      total_ratings: parseInt(stats.total_ratings, 10),
      tags_breakdown: tagsBreakdownObj,
      recent_comments: recentComments.map(c => ({
        learner_name: 'Anonymous', // Anonymized as per GDPR
        rating: parseFloat(c.rating),
        comment: c.comment,
        timestamp: c.timestamp.toISOString()
      }))
    };
  } catch (error) {
    console.error('Error getting aggregated feedback:', error);
    throw error;
  }
};

/**
 * Get feedback summary (alias for getAggregatedFeedback)
 */
export const getFeedbackSummary = async (courseId) => {
  return getAggregatedFeedback(courseId);
};

/**
 * Get feedback analytics for trainers
 * Returns detailed analytics with rating trends, version breakdown, and date filtering
 */
export const getFeedbackAnalytics = async (courseId, { from, to, version } = {}) => {
  try {
    // Check if course exists
    const course = await db.oneOrNone(
      'SELECT course_id FROM courses WHERE course_id = $1',
      [courseId]
    );

    if (!course) {
      const error = new Error('Course not found');
      error.status = 404;
      throw error;
    }

    // Build date filter
    let dateFilter = '';
    const params = [courseId];
    if (from) {
      dateFilter += ` AND f.created_at >= $${params.length + 1}`;
      params.push(new Date(from));
    }
    if (to) {
      dateFilter += ` AND f.created_at <= $${params.length + 1}`;
      params.push(new Date(to));
    }

    // Get overall stats
    const stats = await db.oneOrNone(
      `SELECT 
        AVG(f.rating) as average_rating,
        COUNT(*) as total_feedback
      FROM feedback f
      WHERE f.course_id = $1 ${dateFilter}`,
      params
    );

    // Get rating trend (daily averages)
    const ratingTrend = await db.any(
      `SELECT 
        DATE(f.created_at) as date,
        AVG(f.rating) as avg_rating
      FROM feedback f
      WHERE f.course_id = $1 ${dateFilter}
      GROUP BY DATE(f.created_at)
      ORDER BY date ASC`,
      params
    );

    // Get tag breakdown
    const tagBreakdown = await db.any(
      `SELECT 
        tag,
        AVG(f.rating) as avg_rating
      FROM feedback f, jsonb_array_elements_text(f.tags) as tag
      WHERE f.course_id = $1 ${dateFilter}
      GROUP BY tag`,
      params
    );

    const tagsBreakdownObj = {};
    tagBreakdown.forEach(item => {
      tagsBreakdownObj[item.tag] = parseFloat(item.avg_rating);
    });

    // Get version breakdown (if version filtering is not applied)
    let versions = [];
    if (!version) {
      const versionStats = await db.any(
        `SELECT 
          v.version_no,
          AVG(f.rating) as avg_rating
        FROM versions v
        LEFT JOIN feedback f ON f.course_id = v.course_id 
          AND f.created_at >= v.created_at
          AND (v.published_at IS NULL OR f.created_at <= v.published_at + INTERVAL '30 days')
        WHERE v.course_id = $1
        GROUP BY v.version_no
        ORDER BY v.version_no DESC`,
        [courseId]
      );

      versions = versionStats.map(v => ({
        version_no: v.version_no,
        avg_rating: parseFloat(v.avg_rating) || 0
      }));
    } else {
      // If specific version requested, get stats for that version only
      const versionInfo = await db.oneOrNone(
        `SELECT version_no FROM versions WHERE course_id = $1 AND version_no = $2`,
        [courseId, parseInt(version, 10)]
      );
      if (versionInfo) {
        versions = [{
          version_no: versionInfo.version_no,
          avg_rating: parseFloat(stats?.average_rating) || 0
        }];
      }
    }

    return {
      course_id: courseId,
      average_rating: parseFloat(stats?.average_rating) || 0,
      total_feedback: parseInt(stats?.total_feedback || 0, 10),
      rating_trend: ratingTrend.map(t => ({
        date: t.date.toISOString().split('T')[0],
        avg_rating: parseFloat(t.avg_rating)
      })),
      tags_breakdown: tagsBreakdownObj,
      versions: versions
    };
  } catch (error) {
    console.error('Error getting feedback analytics:', error);
    throw error;
  }
};

export const feedbackService = {
  submitFeedback,
  addFeedback: submitFeedback, // Alias
  getAggregatedFeedback,
  getFeedbackSummary,
  getFeedbackAnalytics
};

