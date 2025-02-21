exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email is required" }),
    };
  }

  const apiKey = process.env.MAILCHIMP_API_KEY; // Store your API key in Netlify's environment variables
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID; // Store your Audience ID in Netlify's environment variables
  const dataCenter = apiKey.split('-')[1]; // Extract the data center from the API key

  const url = `https://${dataCenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

  const data = {
    email_address: email,
    status: 'subscribed',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `apikey ${apiKey}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email submitted successfully!" }),
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: responseData.title || "Something went wrong" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
