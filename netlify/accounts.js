exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username, email, password } = JSON.parse(event.body || '{}');

    const line = `"${username}","${email}","${password}"\n`;

    // ⛔ You can't write files on Netlify Functions
    // ✅ Instead: Store this line in an external DB or log it
    console.log("📥 Account created:", line);

    // In production, send this to Google Sheets, Supabase, etc.
    return {
      statusCode: 200,
      body: "✅ Account saved (mocked)"
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: "❌ Invalid request data"
    };
  }
};
