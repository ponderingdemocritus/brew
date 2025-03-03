import { createFileRoute } from "@tanstack/react-router";
import SuppliersManager from "../components/SuppliersManager";

export const Route = createFileRoute("/suppliers")({
  component: Suppliers,
});

function Suppliers() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Coffee Suppliers
      </h1>
      <SuppliersManager />
    </div>
  );
}
