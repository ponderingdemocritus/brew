import { createFileRoute } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/extractions")({
  component: Extractions,
});

function Extractions() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Coffee Extractions
      </h1>
      <App />
    </div>
  );
}
