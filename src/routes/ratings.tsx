import { createFileRoute } from "@tanstack/react-router";
import BeanRatingsManager from "../components/BeanRatingsManager";
import GlobalRatings from "../components/GlobalRatings";
import { useState } from "react";

export const Route = createFileRoute("/ratings")({
  component: Ratings,
});

function Ratings() {
  const [activeTab, setActiveTab] = useState<"my" | "global">("my");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bean Ratings</h1>

      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("my")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "my"
                ? "text-[#8c7851] border-b-2 border-[#8c7851]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            My Ratings
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "global"
                ? "text-[#8c7851] border-b-2 border-[#8c7851]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Global Feed
          </button>
        </div>
      </div>

      {activeTab === "my" ? <BeanRatingsManager /> : <GlobalRatings />}
    </div>
  );
}
