import React from "react";

const mockUsers = [
  { name: "Wall Street Willie", value: 325.75 },
  { name: "Fantasy Fred", value: 290.10 },
  { name: "Trader Tina", value: 268.40 },
  { name: "A.I. Analyst", value: 243.60 },
  { name: "StatStakesBot", value: 221.00 }
];

export default function Leaderboard() {
  const sorted = [...mockUsers].sort((a, b) => b.value - a.value);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">🏆 Leaderboard</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Rank</th>
            <th className="p-2">Name</th>
            <th className="p-2">Portfolio Value</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((user, idx) => (
            <tr key={user.name} className="border-t">
              <td className="p-2">{idx + 1}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">${user.value.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
