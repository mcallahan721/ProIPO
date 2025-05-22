import React from "react";
import AthleteMarket from "./AthleteMarket.jsx";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">📊 StatStakes: Fantasy Athlete Stock Market</h1>
      <AthleteMarket onBuy={() => {}} />
    </div>
  );
}
