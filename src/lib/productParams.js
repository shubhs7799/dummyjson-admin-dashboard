export const PAGE_SIZES = [10, 20, 50];

export const SORT_VALUES = [
  "",
  "price-asc",
  "price-desc",
  "rating-asc",
  "rating-desc",
  "title-asc",
  "title-desc",
];

export function parseProductParams(searchParams, categorySlugs = []) {
  const rawPage = Number(searchParams.get("page"));
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;

  const rawSize = Number(searchParams.get("size"));
  const pageSize = PAGE_SIZES.includes(rawSize) ? rawSize : 10;

  const q = (searchParams.get("q") || "").trim();

  const rawCategory = searchParams.get("category") || "";
  const category =
    rawCategory && categorySlugs.includes(rawCategory) ? rawCategory : "";

  const rawSort = searchParams.get("sort") || "";
  const sort = SORT_VALUES.includes(rawSort) ? rawSort : "";

  return { page, pageSize, q, category, sort };
}

export function buildProductQuery({ page, pageSize, q, category, sort }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (!q && category) params.set("category", category);
  if (sort) params.set("sort", sort);
  if (pageSize !== 10) params.set("size", String(pageSize));
  if (page !== 1) params.set("page", String(page));
  return params.toString();
}
