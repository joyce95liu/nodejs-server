module.exports = function (app) {

  app.post('/api/course/:courseId/section', createSection);
  app.get('/api/course/:courseId/section', findSectionsForCourse);
  app.post('/api/section/:sectionId/enrollment', enrollStudentInSection);
  app.get('/api/student/section', findSectionsForStudent);
  app.delete('/api/section/:sectionId', deleteSection);
  app.put('/api/section/:sectionId', updateSection);

  var sectionModel = require('../models/section/section.model.server');
  var enrollmentModel = require('../models/enrollment/enrollment.model.server');

  function findSectionsForStudent(req, res) {
    var currentUser = req.session.currentUser;
    var studentId = currentUser._id;
    enrollmentModel
      .findSectionsForStudent(studentId)
      .then(function(enrollments) {
        res.json(enrollments);
      });
  }

  function enrollStudentInSection(req, res) {
      var sectionId = req.params.sectionId;
      var currentUser = req.session.currentUser;
      var studentId = currentUser._id;
      var enrollment = {
          student: studentId,
          section: sectionId
      };
      // res.json(enrollment);

      // enrollmentModel
      //     .enrollStudentInSection(enrollment)
      //     .then(function (enrollment) {
      //       res.json(enrollment);
      //     })

        sectionModel
          .decrementSectionSeats(sectionId)
          .then(function () {
            return enrollmentModel
              .enrollStudentInSection(enrollment)
          })
          .then(function (enrollment) {
            res.json(enrollment);
          })
      }


  function findSectionsForCourse(req, res) {
    var courseId = req.params['courseId'];
    sectionModel
      .findSectionsForCourse(courseId)
      .then(function (sections) {
        res.json(sections);
      })
  }

  function createSection(req, res) {
    var section = req.body;
    sectionModel
      .createSection(section)
      .then(function (section) {
        res.json(section);
      })
  }

   function deleteSection(req,res) {
       var sectionId = req.params['sectionId'];
       // sectionModel.findSectionById(sectionId)
       //     .then(function(section) {
       //         sectionModel.deleteSection(section)
       //     })
       //     .then(function(response) {
       //         res.json(response);
       //     })
       sectionModel.deleteSection(sectionId)
           .then(function(response) {
                       res.json(response);
                   })
   }

   function updateSection(req,res) {
       var sectionId = req.params['sectionId'];
       var credentials = req.body;
       sectionModel
           .updateSection(sectionId,credentials)
           .then(function(response) {
               res.json(response);
           })
   }
};