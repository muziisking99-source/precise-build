"use client";

import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { prefersReducedMotion } from "./motion/transitions";
import { useCategoryTransition, type CategoryKey } from "./motion/CategoryTransition";
import {
  bulkProductsQueryOptions,
  categoryCatalogQueryOptions,
  rangeCharactersQueryOptions,
  singleCatalogQueryOptions,
} from "@/lib/queries/options";

type CategoryExploreLinkProps = {
  to: string;
  category: CategoryKey;
  title: string;
  image: string | null;
  className?: string;
  children: React.ReactNode;
};

export function CategoryExploreLink({
  to,
  category,
  title,
  image,
  className = "",
  children,
}: CategoryExploreLinkProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { startTransition } = useCategoryTransition();
  const reduced = prefersReducedMotion();

  const prefetch = () => {
    if (category === "single") {
      void queryClient.prefetchQuery(singleCatalogQueryOptions());
      void queryClient.prefetchQuery(rangeCharactersQueryOptions());
    } else if (category === "bulk") {
      void queryClient.prefetchQuery(bulkProductsQueryOptions());
    } else {
      void queryClient.prefetchQuery(categoryCatalogQueryOptions(category));
      void queryClient.prefetchQuery(rangeCharactersQueryOptions());
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const card = e.currentTarget.closest(".category-card");
    const imageEl = card?.querySelector(".category-card-image");
    const rect = imageEl?.getBoundingClientRect();

    if (!rect) return;

    e.preventDefault();
    await startTransition({ category, title, image, rect });
    navigate({ to });
  };

  return (
    <Link
      to={to}
      className={className}
      onClick={handleClick}
      onMouseEnter={prefetch}
      onFocus={prefetch}
    >
      {children}
    </Link>
  );
}
