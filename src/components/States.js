// src/components/States.js
// Small reusable UI pieces for the three async states every list page needs:
// loading, error (with a Retry button), and empty. Kept tiny and generic so
// they can be reused across the product list, details, etc.

// A simple centered loading indicator.
export function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
      {/* Pure-CSS spinner (no external library). */}
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      <span>{label}</span>
    </div>
  );
}

// Error state with a Retry button. `onRetry` is called when clicked.
export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-red-600">{message || "Something went wrong."}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// Empty state shown when a successful request returns no items.
export function EmptyState({ message = "No products found." }) {
  return (
    <div className="flex items-center justify-center py-16 text-gray-500">
      {message}
    </div>
  );
}
