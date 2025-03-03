import { createFileRoute } from "@tanstack/react-router";
import BeansManager from "../components/BeansManager";

export const Route = createFileRoute("/beans")({
  component: Beans,
});

function Beans() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Coffee Beans</h1>
      <BeansManager />
    </div>
  );
}
