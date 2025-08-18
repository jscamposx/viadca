export const buildPaginatedParams = ({ page, limit, search } = {}) => {
  const params = {};
  if (typeof page !== "undefined") params.page = page;
  if (typeof limit !== "undefined") params.limit = limit;
  if (typeof search === "string" && search.trim().length > 0)
    params.search = search;
  return params;
};
