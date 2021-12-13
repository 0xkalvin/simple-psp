const MAX_PAGINATION_LIMIT = 200;

const parsePaginationParameters = (page = 1, limit = 100) => {
  let parsedPage = Number(page);
  let parsedLimit = Number(limit);

  // It should not allow fetching more than a safe limit
  if (parsedLimit > MAX_PAGINATION_LIMIT) {
    parsedLimit = MAX_PAGINATION_LIMIT;
  }

  if (parsedPage <= 0) {
    parsedPage = 1;
  }

  return {
    offset: (parsedPage - 1) * parsedLimit,
    limit: parsedLimit,
  };
};

module.exports = {
  parsePaginationParameters,
};
