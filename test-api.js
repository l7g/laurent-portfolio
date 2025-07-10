// Quick test script to check the API endpoints
const fetch = require("node-fetch");

async function testAPI() {
  try {
    console.log("Testing GET /api/settings/show_education...");
    const response = await fetch(
      "http://localhost:3000/api/settings/show_education",
    );

    if (response.ok) {
      const data = await response.json();
      console.log("GET Success:", data);
    } else {
      console.log("GET Status:", response.status);
      const error = await response.json();
      console.log("GET Error:", error);
    }
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testAPI();
