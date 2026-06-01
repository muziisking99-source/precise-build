import { createFileRoute } from "@tanstack/react-router";
import { AnimatedOutlet } from "../components/motion/AnimatedOutlet";

export const Route = createFileRoute("/products")({
  component: ProductsLayout,
});

function ProductsLayout() {
  return <AnimatedOutlet />;
}
