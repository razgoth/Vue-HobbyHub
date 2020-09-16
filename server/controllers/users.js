var User = require('../models/users');


const createUser = (req, res) => {

    var registration_date = Date.now();
    var adminPermissions = (req.body.admin || false);

    var user = new User({
        username: req.body.username,
        password: req.body.password,
        admin: adminPermissions,
        registrationDate: registration_date
    });
    user.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling post request to users.',
                createdUser : result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

const getAllUsers = (req, res, next) => {
    User.find(function (err, users) {
        if (err) {
            return next(err);
        }
        res.json(
            {"users": users}
        );
    });
}

const getUserById = (req, res, next) => {
    var id = req.params.id;
    User.findById(id, function(err, user) {
        if (err) {
            return next(err);
        }
        if (user == null) {
            return res.status(404).json(
                {message: "User not found."}
            );
        }
        res.json(user);
    });
};

const updateUserById = (req, res, next) => {
    var id = req.params.id;
    User.findById(id, function (err, user){
        if (err) { return next(err); }
        if (user == null) {
            return res.status(404).json(
                {"message": "User not found."});
        }
        user.username = req.body.username;
        user.password = req.body.password;
        user.admin = req.body.admin;
        user.save();
        res.json(user);
    });
};

const patchUserById = (req, res, next) => {
    var id = req.params.id;
    User.findById(id, function (err, user){
        if (err) {
            return next(err);
        }
        if (user == null) {
            return res.status(404).json(
                {"message": "User not found."});
        }
        user.username = (req.body.username || user.username);
        user.password = (req.body.password || user.password);

        // In case the admin permissions weren't changed by the patch request the following
        // if statement surpasses the validation error occurring due to the undefined value
        if (req.body.admin != undefined){
            user.admin = (String(req.body.admin) || user.admin);
        }
        user.save();
        res.json(user);
    });
};

const deleteUserById = (req, res, next) => {
    var id = req.params.id;
    User.findOneAndDelete({_id: id}, function(err, user){
        if (err) {
            return next(err);
        }
        if (user == null) {
            return res.status(404).json(
                {"message": "User not found."});
        }
        res.json(user);
    });
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    patchUserById,
    deleteUserById
};