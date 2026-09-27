const db = require("../config/db");

// Student applies for a WIL opportunity
const applyForOpportunity = (req, res) => {
  const userId = req.user.userId;
  const opportunityId = req.params.id;

  const findStudentSql = `
    SELECT StudentID
    FROM StudentProfile
    WHERE UserID = ?
  `;

  db.query(findStudentSql, [userId], (err, studentResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (studentResults.length === 0) {
      return res.status(404).json({
        message: "Student profile not found"
      });
    }

    const studentId = studentResults[0].StudentID;

    const opportunitySql = `
      SELECT OpportunityID
      FROM WILOpportunities
      WHERE OpportunityID = ?
        AND Status = 'Open'
    `;

    db.query(
      opportunitySql,
      [opportunityId],
      (err, opportunityResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Database error"
          });
        }

        if (opportunityResults.length === 0) {
          return res.status(404).json({
            message: "Opportunity not found or is no longer open"
          });
        }

        const insertSql = `
          INSERT INTO WILApplications
          (StudentID, OpportunityID)
          VALUES (?, ?)
        `;

        db.query(
          insertSql,
          [studentId, opportunityId],
          (err, result) => {
            if (err) {
              console.error(err);

              // Duplicate application
              if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                  message: "You have already applied for this opportunity"
                });
              }

              return res.status(500).json({
                message: "Could not submit application"
              });
            }

            res.status(201).json({
              message: "Application submitted successfully",
              applicationId: result.insertId
            });
          }
        );
      }
    );
  });
};


const getMyApplications = (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT
      wa.ApplicationID,
      wa.DateApplied,
      wa.Status,
      wo.OpportunityID,
      wo.Title,
      wo.Description,
      wo.FieldOfStudy,
      wo.EmploymentType,
      wo.Location,
      wo.ClosingDate,
      cp.CompanyName
    FROM WILApplications wa
    INNER JOIN StudentProfile sp
      ON wa.StudentID = sp.StudentID
    INNER JOIN WILOpportunities wo
      ON wa.OpportunityID = wo.OpportunityID
    INNER JOIN CompanyProfile cp
      ON wo.EmployerID = cp.EmployerID
    WHERE sp.UserID = ?
    ORDER BY wa.DateApplied DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.status(200).json({
      applications: results
    });
  });
};

const getOpportunityApplicants = (req, res) => {
  const userId = req.user.userId;
  const opportunityId = req.params.id;

  const sql = `
    SELECT
      wa.ApplicationID,
      wa.DateApplied,
      wa.Status,
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
    FROM WILApplications wa
    INNER JOIN StudentProfile sp
      ON wa.StudentID = sp.StudentID
    INNER JOIN Users u
      ON sp.UserID = u.UserID
    INNER JOIN WILOpportunities wo
      ON wa.OpportunityID = wo.OpportunityID
    INNER JOIN CompanyProfile cp
      ON wo.EmployerID = cp.EmployerID
    WHERE wa.OpportunityID = ?
      AND cp.UserID = ?
    ORDER BY wa.DateApplied DESC
  `;

  db.query(
    sql,
    [opportunityId, userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error"
        });
      }

      res.status(200).json({
        applicants: results
      });
    }
  );
};


// Employer updates an applicant's status
const updateApplicationStatus = (req, res) => {
  const userId = req.user.userId;
  const applicationId = req.params.id;
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "Under Review",
    "Accepted",
    "Rejected",
    "Withdrawn"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid application status"
    });
  }

  const sql = `
    UPDATE WILApplications wa
    INNER JOIN WILOpportunities wo
      ON wa.OpportunityID = wo.OpportunityID
    INNER JOIN CompanyProfile cp
      ON wo.EmployerID = cp.EmployerID
    SET wa.Status = ?
    WHERE wa.ApplicationID = ?
      AND cp.UserID = ?
  `;

  db.query(
    sql,
    [status, applicationId, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Could not update application status"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Application not found or you do not have permission"
        });
      }

      res.status(200).json({
        message: "Application status updated successfully"
      });
    }
  );
};

const withdrawApplication = (req, res) => {
  const userId = req.user.userId;
  const applicationId = req.params.id;

  const sql = `
    UPDATE WILApplications wa
    INNER JOIN StudentProfile sp
      ON wa.StudentID = sp.StudentID
    SET wa.Status = 'Withdrawn'
    WHERE wa.ApplicationID = ?
      AND sp.UserID = ?
  `;

  db.query(
    sql,
    [applicationId, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Could not withdraw application"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Application not found or you do not have permission"
        });
      }

      res.status(200).json({
        message: "Application withdrawn successfully"
      });
    }
  );
};


module.exports = {
  applyForOpportunity,
  getMyApplications,
  getOpportunityApplicants,
  updateApplicationStatus,
  withdrawApplication
};