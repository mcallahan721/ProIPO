import React, { useEffect, useState } from "react";

export default function AthleteMarket({ onBuy, externalPlayers, setExternalPlayers }) {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortBy, setSortBy] = useState("price-desc");
  const [filterBy, setFilterBy] = useState("ALL");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    if (!externalPlayers || externalPlayers.length === 0) {
      fetchPlayers();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchPlayers() {
    try {
      const res = await fetch("/api/players");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Unexpected API response");
      setExternalPlayers(data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching athlete data:", error);
      setErrorMessage("Failed to load player data.");
    } finally {
      setLoading(false);
    }
  }

  const getSortedAndFilteredPlayers = () => {
    let filtered = [...externalPlayers];
    if (filterBy !== "ALL") {
      filtered = filtered.filter(p => p.position === filterBy);
    }

    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
  };

  const sortedPlayers = getSortedAndFilteredPlayers();

  if (loading) return <div className="text-gray-600">Loading players...</div>;
  if (errorMessage) return <div className="text-red-600">{errorMessage}</div>;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">🏈 Player Market</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="mr-2 font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="price-desc">Price (High → Low)</option>
            <option value="price-asc">Price (Low → High)</option>
            <option value="name-asc">Name (A → Z)</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-medium">Filter by position:</label>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="ALL">All</option>
            <option value="QB">QB</option>
            <option value="RB">RB</option>
            <option value="WR">WR</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-sm sm:text-base">
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
            {sortedPlayers.map((player) => (
              <tr
                key={player.id}
                className="border-t hover:bg-gray-50"
                onClick={() => setSelectedPlayer(player)}
              >
                <td className="p-2">{player.name}</td>
                <td className="p-2">{player.team}</td>
                <td className="p-2">{player.position}</td>
                <td className="p-2">${player.price.toFixed(2)}</td>
                <td className="p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuy(player);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs sm:text-sm"
                  >
                    Buy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-xl font-bold mb-2">{selectedPlayer.name}</h3>
            <p className="text-gray-700 mb-1">Team: {selectedPlayer.team}</p>
            <p className="text-gray-700 mb-1">Position: {selectedPlayer.position}</p>
            <p className="text-gray-700 mb-3">Current Price: ${selectedPlayer.price.toFixed(2)}</p>

            <p className="text-gray-700 font-medium mt-4 mb-2">📊 Key Stats:</p>
            {selectedPlayer.position === "QB" && (
              <ul className="text-gray-600 text-sm list-disc list-inside mb-3">
                <li>Passing Yards: {selectedPlayer.stats?.passingYards}</li>
                <li>Touchdowns: {selectedPlayer.stats?.touchdowns}</li>
                <li>Interceptions: {selectedPlayer.stats?.interceptions}</li>
              </ul>
            )}
            {selectedPlayer.position === "RB" && (
              <ul className="text-gray-600 text-sm list-disc list-inside mb-3">
                <li>Rushing Yards: {selectedPlayer.stats?.rushingYards}</li>
                <li>Touchdowns: {selectedPlayer.stats?.touchdowns}</li>
                <li>Receptions: {selectedPlayer.stats?.receptions}</li>
              </ul>
            )}
            {selectedPlayer.position === "WR" && (
              <ul className="text-gray-600 text-sm list-disc list-inside mb-3">
                <li>Receiving Yards: {selectedPlayer.stats?.receivingYards}</li>
                <li>Touchdowns: {selectedPlayer.stats?.touchdowns}</li>
                <li>Receptions: {selectedPlayer.stats?.receptions}</li>
              </ul>
            )}

            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
              onClick={() => setSelectedPlayer(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
