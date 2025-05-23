// pages/api/espn.js
export default async function handler(req, res) {
  try {
    const response = await fetch("https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes?limit=50&active=true");
    const data = await response.json();

    if (!data.items) {
      return res.status(500).json({ error: "Invalid ESPN response" });
    }

    const players = await Promise.all(
      data.items.map(async (item) => {
        const playerRes = await fetch(item.$ref);
        const playerData = await playerRes.json();

        return {
          id: playerData.id,
          name: playerData.fullName,
          team: playerData.team?.abbreviation || "Unknown",
          position: playerData.position?.abbreviation || "N/A",
          price: parseFloat((Math.random() * 40 + 10).toFixed(2)),
          stats: {
            jersey: playerData.jersey,
            weight: playerData.weight,
            height: playerData.height,
            age: playerData.age
          }
        };
      })
    );

    return res.status(200).json(players);
  } catch (err) {
    console.error("Failed to fetch ESPN data", err);
    return res.status(500).json({ error: "Failed to load ESPN data" });
  }
}
