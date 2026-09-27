const db = require("../config/db");

const createOpportunity = (req, res) => {
  const userId = req.user.userId;

  const {
    title,
    description,
    fieldOfStudy,
    employmentType,
    location,
    closingDate
  } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Opportunity title is required"
    });
  }

  const findEmployerSql = `
    SELECT EmployerID
    FROM CompanyProfile
    WHERE UserID = ?
  `;

  db.query(findEmployerSql, [userId], (err, employerResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (employerResults.length === 0) {
      return res.status(404).json({
        message: "Company profile not found"
      });
    }

    const employerId = employerResults[0].EmployerID;

    const sql = `
      INSERT INTO WILOpportunities
      (
        EmployerID,
        Title,
        Description,
        FieldOfStudy,
        EmploymentType,
        Location,
        ClosingDate
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        employerId,
        title,
        description || null,
        fieldOfStudy || null,
        employmentType || null,
        location || null,
        closingDate || null
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Could not create opportunity"
          });
        }

        res.status(201).json({
          message: "WIL opportunity created successfully",
          opportunityId: result.insertId
        });
      }
    );
  });
};

const getMyOpportunities = (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT
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
      cp.LogoURL
    FROM WILOpportunities wo
    INNER JOIN CompanyProfile cp
      ON wo.EmployerID = cp.EmployerID
    WHERE cp.UserID = ?
    ORDER BY wo.PostedDate DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.status(200).json({
      opportunities: results
    });
  });
};

const getAllOpportunities = (req, res) => {
  const sql = `
    SELECT
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
      cp.Industry,
      cp.LogoURL
    FROM WILOpportunities wo
    INNER JOIN CompanyProfile cp
      ON wo.EmployerID = cp.EmployerID
    WHERE wo.Status = 'Open'
    ORDER BY wo.PostedDate DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.status(200).json({
      opportunities: results
    });
  });
};

const getOpportunityById = (req, res) => {
  const opportunityId = req.params.id;

  const sql = `
    SELECT
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
      cp.Industry,
      cp.LogoURL,
      cp.Website,
      cp.Description AS CompanyDescription
    FROM WILOpportunities wo
    INNER JOIN CompanyProfile cp
      ON wo.EmployerID = cp.EmployerID
    WHERE wo.OpportunityID = ?
  `;

  db.query(sql, [opportunityId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Opportunity not found"
      });
    }

    res.status(200).json({
      opportunity: results[0]
    });
  });
};

const updateOpportunity = (req, res) => {
  const userId = req.user.userId;
  const opportunityId = req.params.id;

  const {
    title,
    description,
    fieldOfStudy,
    employmentType,
    location,
    closingDate,
    status
  } = req.body;

  const sql = `
    UPDATE WILOpportunities wo
    INNER JOIN CompanyProfile cp
      ON wo.EmployerID = cp.EmployerID
    SET
      wo.Title = ?,
      wo.Description = ?,
      wo.FieldOfStudy = ?,
      wo.EmploymentType = ?,
      wo.Location = ?,
      wo.ClosingDate = ?,
      wo.Status = ?
    WHERE wo.OpportunityID = ?
      AND cp.UserID = ?
  `;

  db.query(
    sql,
    [
      title,
      description || null,
      fieldOfStudy || null,
      employmentType || null,
      location || null,
      closingDate || null,
      status || "Open",
      opportunityId,
      userId
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Could not update opportunity"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Opportunity not found or you do not have permission to update it"
        });
      }

      res.status(200).json({
        message: "WIL opportunity updated successfully"
      });
    }
  );
};


const deleteOpportunity = (req, res) => {
  const userId = req.user.userId;
  const opportunityId = req.params.id;

  const sql = `
    DELETE wo
    FROM WILOpportunities wo
    INNER JOIN CompanyProfile cp
      ON wo.EmployerID = cp.EmployerID
    WHERE wo.OpportunityID = ?
      AND cp.UserID = ?
  `;

  db.query(
    sql,
    [opportunityId, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Could not delete opportunity"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Opportunity not found or you do not have permission to delete it"
        });
      }

      res.status(200).json({
        message: "WIL opportunity deleted successfully"
      });
    }
  );
};


module.exports = {
  createOpportunity,
  getMyOpportunities,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
};