import { createFileRoute } from "@tanstack/react-router";
import { CategoryTransitionProvider } from "../components/motion/CategoryTransition";
import { ProductsAnimatedOutlet } from "../components/motion/ProductsAnimatedOutlet";
import { prefetchProductRoutes } from "@/lib/queries/options";

export const Route = createFileRoute("/products")({
  loader: ({ context: { queryClient } }) => prefetchProductRoutes(queryClient),
  component: ProductsLayout,
});

function ProductsLayout() {
  return (
    <CategoryTransitionProvider>
      <ProductsAnimatedOutlet />
    </CategoryTransitionProvider>
  );
}
