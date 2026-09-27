const db = require("../config/db");
const fs = require("node:fs");

const getCompanyProfile = (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT
      cp.EmployerID,
      u.FullName,
      u.Email,
      u.PhoneNumber,
      cp.CompanyName,
      cp.LogoURL,
      cp.Industry,
      cp.Website,
      cp.Location,
      cp.Description,
      cp.VerificationStatus
    FROM CompanyProfile cp
    INNER JOIN Users u ON cp.UserID = u.UserID
    WHERE cp.UserID = ?
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
        message: "Company profile not found"
      });
    }

    res.status(200).json({
      profile: results[0]
    });
  });
};

const updateCompanyProfile = (req, res) => {
  const userId = req.user.userId;

  const {
    companyName,
    industry,
    website,
    location,
    description
  } = req.body;

  const sql = `
    UPDATE CompanyProfile
    SET
      CompanyName = ?,
      Industry = ?,
      Website = ?,
      Location = ?,
      Description = ?
    WHERE UserID = ?
  `;

  db.query(
    sql,
    [
      companyName || null,
      industry || null,
      website || null,
      location || null,
      description || null,
      userId
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Could not update company profile"
        });
      }

      res.status(200).json({
        message: "Company profile updated successfully"
      });
    }
  );
};

const uploadCompanyLogo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Choose an image to upload." });
  }

  const logoURL = `/uploads/company-logos/${req.file.filename}`;
  const sql = `
    UPDATE CompanyProfile
    SET LogoURL = ?
    WHERE UserID = ?
  `;

  db.query(sql, [logoURL, req.user.userId], (err, result) => {
    if (err || result.affectedRows === 0) {
      fs.unlink(req.file.path, () => {});
      console.error(err);
      return res.status(err ? 500 : 404).json({
        message: err ? "Could not save company image." : "Company profile not found.",
      });
    }

    return res.status(200).json({
      message: "Company image updated successfully.",
      logoURL,
    });
  });
};

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo,
};