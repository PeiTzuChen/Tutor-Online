const express = require('express')
const router = express.Router()
const classController = require('../controllers/classController')
router.get(
  '/:studentId/completed',
  classController.getCompletedClasses
)
router.get(
  '/teacherbooked/:id',
  classController.getTeacherClasses
)
router.get(
  '/studentbooked/:id',
  classController.getStudentClasses
)

router.get(
  '/:teacherId',
  classController.getCreatedClasses
)
router.patch(
  '/:teacherId',
  classController.patchClasses
)
router.post('/', classController.postClass)
router.delete('/:id', classController.deleteClass)

module.exports = router
