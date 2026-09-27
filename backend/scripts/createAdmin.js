require("dotenv").config();

const bcrypt = require("bcryptjs");
const readline = require("node:readline");
const db = require("../config/db");

function ask(question) {
  return new Promise((resolve) => {
    const terminal = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    terminal.question(question, (answer) => {
      terminal.close();
      resolve(answer.trim());
    });
  });
}

function askSecret(question) {
  return new Promise((resolve, reject) => {
    const input = process.stdin;

    if (!input.isTTY || typeof input.setRawMode !== "function") {
      reject(new Error("Run this command in an interactive terminal to enter the password securely."));
      return;
    }

    let value = "";
    const finish = (error) => {
      input.removeListener("data", onData);
      input.setRawMode(false);
      input.pause();
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    };

    const onData = (chunk) => {
      const character = chunk.toString("utf8");

      if (character === "\u0003") {
        finish(new Error("Admin setup cancelled."));
      } else if (character === "\r" || character === "\n") {
        finish();
      } else if (character === "\u007f" || character === "\b") {
        if (value.length > 0) {
          value = value.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else if (character >= " ") {
        value += character;
        process.stdout.write("*");
      }
    };

    process.stdout.write(question);
    input.setRawMode(true);
    input.resume();
    input.on("data", onData);
  });
}

async function createAdmin() {
  const fullName = await ask("Admin name: ");
  const email = (await ask("Admin email: ")).toLowerCase();

  if (!fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a name and a valid email address.");
  }

  const password = await askSecret("New admin password (12+ characters, input hidden): ");
  const confirmation = await askSecret("Confirm admin password: ");

  if (password.length < 12) {
    throw new Error("Use a password with at least 12 characters.");
  }

  if (password !== confirmation) {
    throw new Error("The passwords do not match.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [existingUsers] = await db.promise().execute(
    "SELECT UserID FROM Users WHERE Email = ?",
    [email]
  );

  if (existingUsers.length > 0) {
    await db.promise().execute(
      "UPDATE Users SET FullName = ?, Password = ?, Role = 'Admin' WHERE UserID = ?",
      [fullName, passwordHash, existingUsers[0].UserID]
    );
    console.log(`Admin account updated for ${email}.`);
  } else {
    await db.promise().execute(
      "INSERT INTO Users (FullName, Email, Password, PhoneNumber, Role) VALUES (?, ?, ?, NULL, 'Admin')",
      [fullName, email, passwordHash]
    );
    console.log(`Admin account created for ${email}.`);
  }

  console.log("Use this email and the password you entered on the normal WIL Connect login page.");
}

createAdmin()
  .catch((error) => {
    console.error(`Admin setup failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await db.promise().end();
    } catch {
      // The connection may already be closed if database initialization failed.
    }
  });