export default async function handler(req, res) {
  console.warn("Serving fallback demo data");

  const fallbackPlayers = [
    { id: 1, name: "Patrick Mahomes", team: "KC", position: "QB", price: 45.5 },
    { id: 2, name: "Jalen Hurts", team: "PHI", position: "QB", price: 42.0 },
    { id: 3, name: "Josh Allen", team: "BUF", position: "QB", price: 40.8 },
    { id: 4, name: "Christian McCaffrey", team: "SF", position: "RB", price: 38.2 },
    { id: 5, name: "Justin Jefferson", team: "MIN", position: "WR", price: 35.1 }
  ];

  return res.status(200).json(fallbackPlayers);
}
