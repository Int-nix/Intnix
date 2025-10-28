const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const MASTER_PASS = "NebulaOS1234";
  const { email, auth } = JSON.parse(event.body || "{}");

  if (auth !== MASTER_PASS) {
    return { statusCode: 403, body: "❌ Incorrect authorization code." };
  }

  const license = "INTNIX-" + Math.floor(Math.random() * 999999).toString().padStart(6, "0");
  const line = `"${email.toLowerCase()}","${license}"\n`;

  // On Netlify, you can't write to files, so simulate storing externally:
  console.log("📥 LICENSE:", line);

  return {
    statusCode: 200,
    body: JSON.stringify({ email, license })
  };
};
