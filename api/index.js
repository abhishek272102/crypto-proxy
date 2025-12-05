export default  async function handler(req, res) {
    // ---- CORS ----
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // ---- Get endpoint from frontend ----
    const { endpoint } = req.query;

    if (!endpoint) {
        return res.status(400).json({ error: "Missing 'endpoint' parameter" });
    }

    // ---- Env keys (optional) ----
    const API_KEY = process.env.API_KEY;

    try {
        // ---- Proxy the request ----
        const response = await fetch(`https://rest.coincap.io/v3/${endpoint}`, {
            headers: {
                "Authorization": `Bearer ${API_KEY ?? ""}`
                
            }
        });

        const data = await response.json();

        // ---- Send the same data back ----
        return res.status(200).json(data);

    } catch (err) {
        console.error("Proxy error:", err);
        return res.status(500).json({ error: "Proxy error" });
    }
}
