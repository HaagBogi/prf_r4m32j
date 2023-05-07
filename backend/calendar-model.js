const mongoose = require('mongoose');

const calendarSchema = mongoose.Schema({
    date: {type: Date, required: true},
    todo: {type: String, required: true},
    user: {type: String, required: true}
});

module.exports = mongoose.model('CalendarSchema', calendarSchema);