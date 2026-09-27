const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Register a new Student or Employer
const register = async (req, res) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    role
  } = req.body;

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({
      message: "Full name, email, password and role are required"
    });
  }

  if (!["Student", "Employer"].includes(role)) {
    return res.status(400).json({
      message: "Role must be Student or Employer"
    });
  }

  try {
    const checkSql = `
      SELECT UserID
      FROM Users
      WHERE Email = ?
    `;

    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Database error"
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          message: "An account with this email already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUserSql = `
        INSERT INTO Users
        (
          FullName,
          Email,
          Password,
          PhoneNumber,
          Role
        )
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        insertUserSql,
        [
          fullName,
          email,
          hashedPassword,
          phoneNumber || null,
          role
        ],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              message: "Could not create account"
            });
          }

          const userId = result.insertId;

          if (role === "Student") {
            const studentSql = `
              INSERT INTO StudentProfile
              (UserID)
              VALUES (?)
            `;

            db.query(studentSql, [userId], (err) => {
              if (err) {
                console.error(err);
                return res.status(500).json({
                  message: "Account created but student profile could not be created"
                });
              }

              return res.status(201).json({
                message: "Student account created successfully",
                userId
              });
            });
          }

          if (role === "Employer") {
            const companySql = `
              INSERT INTO CompanyProfile
              (
                UserID,
                CompanyName,
                VerificationStatus
              )
              VALUES (?, ?, 'Pending')
            `;

            db.query(
              companySql,
              [userId, fullName],
              (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({
                    message: "Account created but company profile could not be created"
                  });
                }

                return res.status(201).json({
                  message: "Employer account created successfully",
                  userId
                });
              }
            );
          }
        }
      );
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Registration failed"
    });
  }
};

// Login
const login = (req, res) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const sql = `
    SELECT
      UserID,
      FullName,
      Email,
      Password,
      Role
    FROM Users
    WHERE Email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = results[0];

    try {
      const passwordMatch = await bcrypt.compare(
        password,
        user.Password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      const token = jwt.sign(
        {
          userId: user.UserID,
          role: user.Role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d"
        }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          userId: user.UserID,
          fullName: user.FullName,
          email: user.Email,
          role: user.Role
        }
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Login failed"
      });
    }
  });
};

module.exports = {
  register,
  login
};