
export default async function handler(req, res) {
    try {
        // Fetch data from the external API
        const response = await fetch("http://95.217.229.171:3000/api/data");

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Send the data back to the client
        res.status(200).json(data);
    } catch (error) {
        // Handle errors and send an appropriate response
        res.status(500).json({ error: "Failed to fetch data from the external API" });
    }
}