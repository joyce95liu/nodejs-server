module.exports = function (app) {

    app.delete('/api/section/:sectionId/enrollment', unEnrollStudentInSection);
    app.post('/api/section/:sectionId/enrollment', enrollStudentInSection);
    app.get('/api/student/section', findSectionsForStudent);

    var enrollmentModel = require('../models/enrollment/enrollment.model.server');
    var sectionModel = require('../models/section/section.model.server');

    function findSectionsForStudent(req, res) {
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        enrollmentModel
            .findSectionsForStudent(studentId)
            .then(function(enrollments) {
                res.json(enrollments);
            });
    }

    function unEnrollStudentInSection (req,res) {
        var sectionId = req.params.sectionId;
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        var enrollment = {
            student: studentId,
            section: sectionId
        };

            enrollmentModel
            .unEnrollStudentInSection(enrollment)
                .then(function () {
                    return sectionModel.incrementSectionSeats(sectionId)
                })
            .then(function (enrollment) {
                res.json(enrollment);
            })
    }

    function enrollStudentInSection(req, res) {
        var sectionId = req.params.sectionId;
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        var enrollment = {
            student: studentId,
            section: sectionId
        };
        sectionModel.findSectionById(sectionId)
            .then( function (section) {
                if (section.seats !==0) {
                    sectionModel
                        .decrementSectionSeats(sectionId)
                        .then(function () {
                            return enrollmentModel
                                .enrollStudentInSection(enrollment)
                        })
                        .then(function (enrollment) {
                            res.json(enrollment);
                        })
                } else {
                    res.sendStatus(404);
                }
            })
    }
}