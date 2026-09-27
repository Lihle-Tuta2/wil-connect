const db = require("../config/db");

// Get all users
const getAllUsers = (req, res) => {
  const sql = `
    SELECT
      UserID,
      FullName,
      Email,
      PhoneNumber,
      Role,
      CreatedAt
    FROM Users
    ORDER BY CreatedAt DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.status(200).json({
      users: results
    });
  });
};


// Get all company profiles
const getAllCompanies = (req, res) => {
  const sql = `
    SELECT
      cp.EmployerID,
      cp.CompanyName,
      cp.Industry,
      cp.Website,
      cp.Location,
      cp.Description,
      cp.VerificationStatus,
      u.FullName,
      u.Email,
      u.PhoneNumber
    FROM CompanyProfile cp
    INNER JOIN Users u
      ON cp.UserID = u.UserID
    ORDER BY cp.EmployerID DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.status(200).json({
      companies: results
    });
  });
};


// Approve a company
const approveCompany = (req, res) => {
  const employerId = req.params.id;

  const sql = `
    UPDATE CompanyProfile
    SET VerificationStatus = 'Approved'
    WHERE EmployerID = ?
  `;

  db.query(sql, [employerId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Could not approve company"
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    res.status(200).json({
      message: "Company approved successfully"
    });
  });
};


// Reject a company
const rejectCompany = (req, res) => {
  const employerId = req.params.id;

  const sql = `
    UPDATE CompanyProfile
    SET VerificationStatus = 'Rejected'
    WHERE EmployerID = ?
  `;

  db.query(sql, [employerId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Could not reject company"
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    res.status(200).json({
      message: "Company rejected successfully"
    });
  });
};


// Get all WIL opportunities
const getAllOpportunitiesAdmin = (req, res) => {
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
      cp.VerificationStatus
    FROM WILOpportunities wo
    INNER JOIN CompanyProfile cp
      ON wo.EmployerID = cp.EmployerID
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


module.exports = {
  getAllUsers,
  getAllCompanies,
  approveCompany,
  rejectCompany,
  getAllOpportunitiesAdmin
};