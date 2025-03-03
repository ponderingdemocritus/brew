import { createFileRoute } from "@tanstack/react-router";
import BeanRatingsManager from "../components/BeanRatingsManager";

export const Route = createFileRoute("/ratings")({
  component: Ratings,
});

function Ratings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bean Ratings</h1>
      <BeanRatingsManager />
    </div>
  );
}
