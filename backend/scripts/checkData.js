/**
 * Check if mock data exists in database
 */

import db, { pgp } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkData() {
  try {
    console.log('🔍 Checking database for mock data...\n');

    // Check courses
    const courses = await db.any('SELECT id, course_name, course_type, status FROM courses ORDER BY created_at DESC LIMIT 5');
    console.log(`📚 Courses found: ${courses.length}`);
    courses.forEach(course => {
      console.log(`   - ${course.course_name} (${course.id.substring(0, 8)}...) - ${course.course_type} - ${course.status}`);
    });

    // Check topics
    const topics = await db.any('SELECT id, course_id, topic_name FROM topics ORDER BY id DESC LIMIT 5');
    console.log(`\n📖 Topics found: ${topics.length}`);
    topics.forEach(topic => {
      console.log(`   - ${topic.topic_name} (${topic.id.substring(0, 8)}...)`);
    });

    // Check modules
    const modules = await db.any('SELECT id, topic_id, module_name FROM modules ORDER BY id DESC LIMIT 5');
    console.log(`\n📦 Modules found: ${modules.length}`);
    modules.forEach(module => {
      console.log(`   - ${module.module_name} (${module.id.substring(0, 8)}...)`);
    });

    // Check lessons
    const lessons = await db.any('SELECT id, module_id, lesson_name FROM lessons ORDER BY id DESC LIMIT 5');
    console.log(`\n📝 Lessons found: ${lessons.length}`);
    lessons.forEach(lesson => {
      console.log(`   - ${lesson.lesson_name} (${lesson.id.substring(0, 8)}...)`);
    });

    // Check registrations
    const registrations = await db.any('SELECT id, learner_id, learner_name, course_id, status FROM registrations ORDER BY enrolled_date DESC LIMIT 5');
    console.log(`\n👤 Registrations found: ${registrations.length}`);
    registrations.forEach(reg => {
      console.log(`   - ${reg.learner_name} enrolled in course (${reg.id.substring(0, 8)}...) - ${reg.status}`);
    });

    // Check for specific mock IDs
    console.log('\n🎯 Checking for specific mock IDs:');
    const mockCourseId = '11111111-1111-1111-1111-111111111111';
    const mockLearnerId = '00000000-0000-0000-0000-000000000002';
    const mockTrainerId = '00000000-0000-0000-0000-000000000001';

    const mockCourse = await db.oneOrNone('SELECT * FROM courses WHERE id = $1', [mockCourseId]);
    if (mockCourse) {
      console.log(`   ✅ Mock course found: ${mockCourse.course_name}`);
    } else {
      console.log(`   ❌ Mock course NOT found (ID: ${mockCourseId})`);
    }

    const mockRegistration = await db.oneOrNone('SELECT * FROM registrations WHERE learner_id = $1', [mockLearnerId]);
    if (mockRegistration) {
      console.log(`   ✅ Mock registration found for learner: ${mockRegistration.learner_name}`);
    } else {
      console.log(`   ❌ Mock registration NOT found (Learner ID: ${mockLearnerId})`);
    }

    console.log('\n✅ Database check completed!');

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    pgp.end();
  }
}

checkData().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

