
export const handler = async (event) => {
  try {
    const json = typeof event === "string" ? JSON.parse(event) : event;

    const issueUrl = json.issue?.html_url || "No issue URL found";

    const payload = {
      text: `Issue Created: ${issueUrl}`,
    };

    const slackUrl = process.env.SLACK_URL;
    if (!slackUrl) {
      throw new Error("Missing SLACK_URL environment variable");
    }

    const response = await fetch(slackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    return {
      statusCode: response.ok ? 200 : response.status,
      body: responseText,
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};