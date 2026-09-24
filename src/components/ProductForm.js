"use client";

import { useState } from "react";

function validate(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  } else if (values.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }

  if (!values.category.trim()) {
    errors.category = "Category is required.";
  }

  if (values.price === "" || values.price === null) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(Number(values.price)) || Number(values.price) <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }

  if (values.stock === "" || values.stock === null) {
    errors.stock = "Stock is required.";
  } else if (
    !Number.isInteger(Number(values.stock)) ||
    Number(values.stock) < 0
  ) {
    errors.stock = "Stock must be a whole number of 0 or more.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  } else if (values.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  return errors;
}

export default function ProductForm({
  initialValues,
  categories = [],
  submitting,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}) {
  const [values, setValues] = useState({
    title: initialValues?.title ?? "",
    category: initialValues?.category ?? "",
    price: initialValues?.price ?? "",
    stock: initialValues?.stock ?? "",
    description: initialValues?.description ?? "",
  });
  const [errors, setErrors] = useState({});

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      title: values.title.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
      description: values.description.trim(),
    });
  }

  const inputClass =
    "w-full rounded-lg border px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          className={`${inputClass} ${
            errors.title ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Category
        </label>
        {categories.length > 0 ? (
          <select
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
            className={`${inputClass} ${
              errors.category ? "border-red-400" : "border-gray-300"
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
            className={`${inputClass} ${
              errors.category ? "border-red-400" : "border-gray-300"
            }`}
          />
        )}
        {errors.category && (
          <p className="mt-1 text-xs text-red-600">{errors.category}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => setField("price", e.target.value)}
            className={`${inputClass} ${
              errors.price ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            value={values.stock}
            onChange={(e) => setField("stock", e.target.value)}
            className={`${inputClass} ${
              errors.stock ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          rows={4}
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          className={`${inputClass} ${
            errors.description ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
