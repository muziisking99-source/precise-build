import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  fetchBulkProducts,
  fetchCategoryCarouselImages,
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

export const siteSettingsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.siteSettings,
    queryFn: fetchSiteSettings,
    staleTime: STALE_TIME,
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
  ensureQueryData: (options: ReturnType<typeof categoryHeroesQueryOptions>) => Promise<unknown>;
  prefetchQuery: (options: ReturnType<typeof singleCatalogQueryOptions>) => Promise<unknown>;
}) {
  await Promise.all([
    queryClient.ensureQueryData(categoryHeroesQueryOptions()),
    queryClient.prefetchQuery(singleCatalogQueryOptions()),
    queryClient.prefetchQuery(bulkProductsQueryOptions()),
    queryClient.prefetchQuery(rangeCharactersQueryOptions()),
  ]);
}
