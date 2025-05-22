export default async function handler(req, res) {
  const API_KEY = "bc1b64fd59ee4cf28648a25dd6abdd49";
  const API_URL = "https://api.sportsdata.io/v3/nfl/stats/json/PlayerSeasonStats/2021REG";

  try {
    const response = await fetch(API_URL, {
      headers: { "Ocp-Apim-Subscription-Key": API_KEY }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sportsdata.io API failed:", response.status, errorText);
      return res.status(response.status).json({ error: "API failed", message: errorText });
    }

    const data = await response.json();
    const topPlayers = data
      .filter(p => p.Name && p.FantasyPoints)
      .slice(0, 20)
      .map(p => ({
        id: p.PlayerID,
        name: p.Name,
        team: p.Team,
        position: p.Position,
        price: parseFloat((p.FantasyPoints / 2).toFixed(2)),
      }));

    res.status(200).json(topPlayers);
  } catch (error) {
    console.error("Function crashed:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
