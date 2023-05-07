const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

const SALT_FACTOR = 10;

userSchema.pre('save', function preSaveCallback(next) {
    const _this = this;

    bcrypt.genSalt(SALT_FACTOR, function genSaltCallback(error, salt) {
        if (error) {
            return next(error);
        }

        bcrypt.hash(_this.password, salt, function hashCallback(error2, hash) {
            if (error2) {
                return next(error2);
            }
            _this.password = hash;
            next();
        });
    });
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("UserModel", userSchema);

