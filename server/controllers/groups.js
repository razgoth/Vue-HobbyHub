var Group = require('../models/groups');
var Review = require('../models/reviews');
var User = require('../models/users');
var Promise = require('promise');

const createGroup = (req, res) => {
    const group = new Group(req.body);

    group.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling post request to groups.',
                createdGroup: result
            });
        })
        .catch(err => {
            console.log(err);
            if (err.code === 11000 || err.code === 11001) {
                res.status(409).json({
                    message: 'This user already exists.'
                })
            } else {
                res.status(500).json({
                    error: err
                });
            }
        });
};

const getAllGroups = (req, res, next) => {
    Group.find(function (err, groups) {
        if (err) {
            return next(err);
        }
        res.json(groups);
    });
};

const  getGroupById = (req, res, next) => {
    Group.findById(req.params.id, function(err, group) {
        if (err) {
            return next(err);
        }
        if (group == null) {
            return res.status(404).json(
                {"message": "Group not found."}
            );
        }
        res.json(group);
    });
};

const updateGroupById = (req, res, next) => {
    var id = req.params.id;
    Group.findById(id, function (err, group){
        if (err) { return next(err); }
        if (group == null) {
            return res.status(404).json({"message": "Group not found."});
        }
        group.name = req.body.name;
        group.location = req.body.location;
        group.activity = req.body.activity;
        group.startDate = req.body.startDate;
        group.endDate = req.body.endDate;
        group.thumbnail = req.body.thumbnail;
        group.regMembers = req.body.regMembers;
        group.save();
        res.json(group);
    });
};

const patchGroupById = (req, res, next) => {
    var id = req.params.id;
    Group.findById(id, function (err, group){
        if (err) {
            return next(err);
        }
        if (group == null) {
            return res.status(404).json(
                {"message": "Group not found."});
        }
        group.name = (req.body.name || group.name);
        group.location = (req.body.location || group.location);
        group.activity = (req.body.activity || group.activity);
        group.startDate = (req.body.startDate || group.startDate);
        group.endDate = (req.body.endDate || group.endDate);
        group.thumbnail = (req.body.thumbnail || group.thumbnail);
        group.description = (req.body.description || group.description);
        group.regMembers = (req.body.regMembers || group.regMembers);
        group.save();
        res.json(group);
    });
};

const deleteGroupById = (req, res, next) => {
    var id = req.params.id;
    Group.findOneAndDelete({_id: id}, function(err, group){
        if (err) {
            return next(err);
        }
        if (group == null) {
            return res.status(404).json(
                {"message": "Group not found."});
        }

        Review.deleteMany({ reviewee : id}, function(error, reviews) {
            if (error) {
                return next(error);
            }
            if (reviews == null) {
                return res.status(404).json(
                    {"message": "Review not found."});
            }
        });

        res.json(group);
    });
};

const deleteAllGroups = (req, res, next) => {
  Group.deleteMany(function(err, groups){
      if (err) {
          return next(err);
      }
      if (groups == null) {
          return res.status(404).json(
              {"message": "Groups not found."});
      }
      console.log('Successfully deleted all groups.');
      return res.status(200).json(groups);
  })

};

const searchOwnerGroups = (req, res, next) => {
    const ownerId = req.params.id;
    Group.find({ owner: ownerId}, function(error, groups) {
        if (error) {
            return next(error);
        }
        if (groups == null) {
            return res.status(404).json(
                {"message": "Groups not found."}
            );
        }
        res.json(groups);
    });
}

const getGroupMembers = (req, res, next) => {
    Group.findById(req.params.id, function(err, group) {
        if (err) {
            return next(err);
        }
        if (group == null) {
            return res.status(404).json(
                {"message": "Group not found."}
            );
        }
        var promises = [];
        var listOfMembers = [];
        group.regMembers.forEach(function(memberId){
            let userPromise = User.findById(memberId, function(err, user) {
                if (err) {
                    return next(err);
                }
                if (user == null) {
                    return res.status(404).json(
                        {"message": "Group members not found."}
                    );
                }

                listOfMembers.push(user.username);
                return true
            });
            promises.push(userPromise);
        });

        Promise.all(promises).then(function(result){
            res.json(listOfMembers);

        }).catch(function(err){
            console.log(err)
        });

    });
}

module.exports = {
    createGroup,
    getAllGroups,
    getGroupById,
    updateGroupById,
    patchGroupById,
    deleteGroupById,
    deleteAllGroups,
    searchOwnerGroups,
    getGroupMembers
};