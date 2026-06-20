import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  fetchBulkProducts,
  fetchCategoryBySlug,
  fetchCategoryCatalog,
  fetchCategoryCarouselImages,
  fetchProductCategories,
  fetchHeroPanels,
  fetchHomeRanges,
  fetchRangeCharacters,
  fetchSingleCatalog,
  fetchSingleProductRanges,
  fetchSiteSettings,
  fetchVisibleCharacters,
  fetchVisibleTestimonials,
} from "./fetchers";

export const STALE_TIME = 1000 * 60 * 5;
/** Admin-editable content — refetch often so public site picks up changes quickly */
export const ADMIN_CONTENT_STALE_TIME = 0;

export const siteSettingsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.siteSettings,
    queryFn: fetchSiteSettings,
    staleTime: ADMIN_CONTENT_STALE_TIME,
  });

export const heroPanelsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.heroPanels,
    queryFn: fetchHeroPanels,
    staleTime: STALE_TIME,
  });

export const homeRangesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.homeRanges,
    queryFn: fetchHomeRanges,
    staleTime: STALE_TIME,
  });

export const singleRangesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.singleRanges,
    queryFn: fetchSingleProductRanges,
    staleTime: STALE_TIME,
  });

export const charactersQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.characters,
    queryFn: fetchVisibleCharacters,
    staleTime: STALE_TIME,
  });

export const rangeCharactersQueryOptions = () =>
  queryOptions({
    queryKey: [...queryKeys.characters, "ranges"] as const,
    queryFn: fetchRangeCharacters,
    staleTime: STALE_TIME,
  });

export const testimonialsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.testimonials,
    queryFn: fetchVisibleTestimonials,
    staleTime: STALE_TIME,
  });

export const categoryBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...queryKeys.categoryMeta, slug] as const,
    queryFn: () => fetchCategoryBySlug(slug),
    staleTime: STALE_TIME,
  });

export const categoryCatalogQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...queryKeys.categoryCatalog, slug] as const,
    queryFn: () => fetchCategoryCatalog(slug),
    staleTime: STALE_TIME,
  });

export const productCategoriesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.productCategories,
    queryFn: fetchProductCategories,
    staleTime: STALE_TIME,
  });

export const categoryHeroesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.categoryHeroes,
    queryFn: fetchCategoryCarouselImages,
    staleTime: STALE_TIME,
  });

export const singleCatalogQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.singleCatalog,
    queryFn: fetchSingleCatalog,
    staleTime: STALE_TIME,
  });

export const bulkProductsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.bulkProducts,
    queryFn: fetchBulkProducts,
    staleTime: STALE_TIME,
  });

export async function prefetchHomePage(queryClient: {
  ensureQueryData: (options: ReturnType<typeof siteSettingsQueryOptions>) => Promise<unknown>;
}) {
  await Promise.all([
    queryClient.ensureQueryData(siteSettingsQueryOptions()),
    queryClient.ensureQueryData(heroPanelsQueryOptions()),
    queryClient.ensureQueryData(homeRangesQueryOptions()),
    queryClient.ensureQueryData(charactersQueryOptions()),
    queryClient.ensureQueryData(testimonialsQueryOptions()),
  ]);
}

export async function prefetchProductRoutes(queryClient: {
  ensureQueryData: (options: ReturnType<typeof productCategoriesQueryOptions>) => Promise<unknown>;
}) {
  await Promise.all([
    queryClient.ensureQueryData(productCategoriesQueryOptions()),
    queryClient.ensureQueryData(categoryHeroesQueryOptions()),
    queryClient.ensureQueryData(singleCatalogQueryOptions()),
    queryClient.ensureQueryData(bulkProductsQueryOptions()),
    queryClient.ensureQueryData(rangeCharactersQueryOptions()),
  ]);
}
