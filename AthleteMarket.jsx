import React, { useEffect, useState } from "react";

export default function AthleteMarket({ onBuy }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch("/api/players");
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Unexpected API response");

        setPlayers(data);
        setErrorMessage("");
      } catch (error) {
        console.error("Error fetching athlete data:", error);
        setErrorMessage("Failed to load player data.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  if (loading) return <div className="text-gray-600">Loading players...</div>;
  if (errorMessage) return <div className="text-red-600">{errorMessage}</div>;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">🏈 Player Market</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Team</th>
            <th className="p-2">Pos</th>
            <th className="p-2">Price</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} className="border-t">
              <td className="p-2">{player.name}</td>
              <td className="p-2">{player.team}</td>
              <td className="p-2">{player.position}</td>
              <td className="p-2">${player.price.toFixed(2)}</td>
              <td className="p-2">
                <button
                  onClick={() => onBuy(player)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
