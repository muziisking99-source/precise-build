"use client";

import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  categoryHeroesQueryOptions,
  productCategoriesQueryOptions,
} from "@/lib/queries/options";

export function ProductsBackLink() {
  const queryClient = useQueryClient();

  const prefetch = () => {
    void queryClient.prefetchQuery(productCategoriesQueryOptions());
    void queryClient.prefetchQuery(categoryHeroesQueryOptions());
  };

  return (
    <Link
      to="/products"
      className="products-back"
      onMouseEnter={prefetch}
      onFocus={prefetch}
    >
      ← All categories
    </Link>
  );
}
