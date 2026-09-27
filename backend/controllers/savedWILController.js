const db = require("../config/db");

const saveWIL = (req, res) => {
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

    const checkOpportunitySql = `
      SELECT OpportunityID
      FROM WILOpportunities
      WHERE OpportunityID = ?
    `;

    db.query(
      checkOpportunitySql,
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
            message: "Opportunity not found"
          });
        }

        const insertSql = `
          INSERT INTO SavedWILs
          (StudentID, OpportunityID)
          VALUES (?, ?)
        `;

        db.query(
          insertSql,
          [studentId, opportunityId],
          (err, result) => {
            if (err) {
              console.error(err);

              if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                  message: "Opportunity already saved"
                });
              }

              return res.status(500).json({
                message: "Could not save opportunity"
              });
            }

            res.status(201).json({
              message: "WIL opportunity saved successfully",
              savedWILId: result.insertId
            });
          }
        );
      }
    );
  });
};

const getSavedWILs = (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT
      sw.SavedWILID,
      sw.SavedDate,
      wo.OpportunityID,
      wo.Title,
      wo.Description,
      wo.FieldOfStudy,
      wo.EmploymentType,
      wo.Location,
      wo.ClosingDate,
      wo.PostedDate,
      wo.Status,
      cp.CompanyName,
      cp.Industry
    FROM SavedWILs sw
    INNER JOIN StudentProfile sp
      ON sw.StudentID = sp.StudentID
    INNER JOIN WILOpportunities wo
      ON sw.OpportunityID = wo.OpportunityID
    INNER JOIN CompanyProfile cp
      ON wo.EmployerID = cp.EmployerID
    WHERE sp.UserID = ?
    ORDER BY sw.SavedDate DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.status(200).json({
      savedWILs: results
    });
  });
};

const removeSavedWIL = (req, res) => {
  const userId = req.user.userId;
  const opportunityId = req.params.id;

  const sql = `
    DELETE sw
    FROM SavedWILs sw
    INNER JOIN StudentProfile sp
      ON sw.StudentID = sp.StudentID
    WHERE sw.OpportunityID = ?
      AND sp.UserID = ?
  `;

  db.query(
    sql,
    [opportunityId, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Could not remove saved opportunity"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Saved opportunity not found"
        });
      }

      res.status(200).json({
        message: "Saved opportunity removed successfully"
      });
    }
  );
};


module.exports = {
  saveWIL,
  getSavedWILs,
  removeSavedWIL
};