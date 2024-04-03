const express = require('express')
const router = express.Router()
const classController = require('../controllers/classController')
router.get(
  '/:studentId/completed',
  classController.getCompletedClasses
)
router.patch('/:classId/completed', classController.patchCompletedClass)
router.get(
  '/teacherbooked/:id',
  classController.getTeacherClasses
)
router.get(
  '/studentbooked/:id',
  classController.getStudentClasses
)
router.patch('/studentbooked/:id', classController.patchBookedClass)

router.get(
  '/:teacherId',
  classController.getCreatedClasses
)
router.patch(
  '/:teacherId',
  classController.patchClass
)
router.post('/', classController.postClass)
router.put('/:id', classController.putClass)
router.delete('/:id', classController.deleteClass)
router.get('/history/:classId', classController.getHistory)
module.exports = router
