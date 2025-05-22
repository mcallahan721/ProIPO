export default async function handler(req, res) {
  const API_KEY = "bc1b64fd59ee4cf28648a25dd6abdd49";
  const API_URL = "https://api.sportsdata.io/v3/nfl/stats/json/PlayerSeasonStats/2023REG";

  try {
    const response = await fetch(API_URL, {
      headers: { "Ocp-Apim-Subscription-Key": API_KEY }
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch players." });
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
  } catch (err) {
    console.error("Serverless error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
}
