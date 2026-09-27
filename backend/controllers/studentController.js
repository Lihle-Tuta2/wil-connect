const db = require("../config/db");

const getStudentProfile = (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT
      sp.StudentID,
      u.FullName,
      u.Email,
      u.PhoneNumber,
      sp.StudentNumber,
      sp.Institution,
      sp.Qualification,
      sp.FieldOfStudy,
      sp.GraduationYear,
      sp.CV,
      sp.AcademicTranscript,
      sp.Skills,
      sp.Bio
    FROM StudentProfile sp
    INNER JOIN Users u ON sp.UserID = u.UserID
    WHERE sp.UserID = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Student profile not found"
      });
    }

    res.status(200).json({
      profile: results[0]
    });
  });
};

const updateStudentProfile = (req, res) => {
  const userId = req.user.userId;

  const {
    studentNumber,
    institution,
    qualification,
    fieldOfStudy,
    graduationYear,
    cv,
    academicTranscript,
    skills,
    bio
  } = req.body;

  const sql = `
    UPDATE StudentProfile
    SET
      StudentNumber = ?,
      Institution = ?,
      Qualification = ?,
      FieldOfStudy = ?,
      GraduationYear = ?,
      CV = ?,
      AcademicTranscript = ?,
      Skills = ?,
      Bio = ?
    WHERE UserID = ?
  `;

  db.query(
    sql,
    [
      studentNumber || null,
      institution || null,
      qualification || null,
      fieldOfStudy || null,
      graduationYear || null,
      cv || null,
      academicTranscript || null,
      skills || null,
      bio || null,
      userId
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Could not update student profile"
        });
      }

      res.status(200).json({
        message: "Student profile updated successfully"
      });
    }
  );
};

module.exports = {
  getStudentProfile,
  updateStudentProfile
};