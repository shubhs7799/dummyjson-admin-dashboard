"use client";

function getPageItems(current, totalPages) {
  const items = [];
  const push = (v) => items.push(v);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) push(i);
    return items;
  }

  push(1);
  if (current > 3) push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  for (let i = start; i <= end; i++) push(i);
  if (current < totalPages - 2) push("...");
  push(totalPages);
  return items;
}

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pageItems = getPageItems(page, totalPages);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          Showing {start}–{end} of {total}
        </span>
        <label className="flex items-center gap-2">
          <span>Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-2 py-1 text-gray-900 outline-none focus:border-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {pageItems.map((item, idx) =>
          item === "..." ? (
            <span key={`gap-${idx}`} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={`min-w-9 rounded-md border px-3 py-1.5 text-sm transition ${
                item === page
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
