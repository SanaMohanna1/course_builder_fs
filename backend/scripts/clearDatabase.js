/**
 * Clear all data from database
 * Deletes in proper order to respect foreign key constraints
 */

import db, { pgp } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function clearDatabase() {
  try {
    console.log('🧹 Clearing all data from database...\n');

    // Delete in order (respecting foreign key constraints)
    // Lessons depend on modules and topics
    const lessonsDeleted = await db.result('DELETE FROM lessons');
    console.log(`   ✅ Deleted ${lessonsDeleted.rowCount} lessons`);

    // Modules depend on topics
    const modulesDeleted = await db.result('DELETE FROM modules');
    console.log(`   ✅ Deleted ${modulesDeleted.rowCount} modules`);

    // Topics depend on courses
    const topicsDeleted = await db.result('DELETE FROM topics');
    console.log(`   ✅ Deleted ${topicsDeleted.rowCount} topics`);

    // Assessments depend on courses
    const assessmentsDeleted = await db.result('DELETE FROM assessments');
    console.log(`   ✅ Deleted ${assessmentsDeleted.rowCount} assessments`);

    // Feedback depends on courses
    const feedbackDeleted = await db.result('DELETE FROM feedback');
    console.log(`   ✅ Deleted ${feedbackDeleted.rowCount} feedback entries`);

    // Registrations depend on courses
    const registrationsDeleted = await db.result('DELETE FROM registrations');
    console.log(`   ✅ Deleted ${registrationsDeleted.rowCount} registrations`);

    // Versions depend on entities
    const versionsDeleted = await db.result('DELETE FROM versions');
    console.log(`   ✅ Deleted ${versionsDeleted.rowCount} versions`);

    // Courses (delete last since many things depend on them)
    const coursesDeleted = await db.result('DELETE FROM courses');
    console.log(`   ✅ Deleted ${coursesDeleted.rowCount} courses`);

    console.log('\n✅ Database cleared successfully!');
    console.log('   All tables are now empty and ready for fresh data.\n');

  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    pgp.end();
  }
}

clearDatabase().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

