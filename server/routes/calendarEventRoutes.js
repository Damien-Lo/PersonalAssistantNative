const express = require('express');
const { getAllCalendarEvents, postCalendarEvent, deleteCalendarEvent, patchCalendarEvent, getEventById } = require('../controllers/calendarEventController');

const router = express.Router()

router.get('/', getAllCalendarEvents);
router.get('/:id', getEventById)
router.post('/', postCalendarEvent);
router.delete("/:id", deleteCalendarEvent);
router.patch("/:id", patchCalendarEvent);

module.exports = router;