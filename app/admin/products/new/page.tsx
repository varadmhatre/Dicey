"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  title: string;
  description: string;
  priceInCents: string;
  category: string;
  images: string;
  redirectUrl: string;
  inventoryCount: string;
};

const initialState: FormState = {
  title: "",
  description: "",
  priceInCents: "",
  category: "",
  images: "",
  redirectUrl: "",
  inventoryCount: "0",
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        images: form.images
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      }),
    });

    setLoading(false);

    if (!response.ok) {
      setMessage("Unable to register product. Verify inputs and admin access.");
      return;
    }

    const { product } = await response.json();
    setMessage("Product created successfully.");
    setForm(initialState);
    router.push(`/products/${product.slug}`);
  };

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-8 animate-fade-up">
      <header className="space-y-2">
        <h1 className="font-display text-3xl">Register New Product</h1>
        <p className="text-sm text-muted-foreground">
          Add product metadata and attach the Amazon affiliate URL used by Buy Now.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border bg-white p-6 shadow-noir">
        {[
          ["Title", "title"],
          ["Category", "category"],
          ["Price (cents)", "priceInCents"],
          ["Inventory", "inventoryCount"],
          ["Amazon Redirect URL", "redirectUrl"],
        ].map(([label, field]) => (
          <label key={field} className="block space-y-2 text-sm">
            <span>{label}</span>
            <input
              required
              value={form[field as keyof FormState]}
              onChange={(event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))}
              className="w-full rounded-xl border bg-background px-3 py-2 outline-none ring-0 transition focus:border-foreground"
            />
          </label>
        ))}

        <label className="block space-y-2 text-sm">
          <span>Description</span>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="w-full rounded-xl border bg-background px-3 py-2 outline-none transition focus:border-foreground"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Image URLs (one per line)</span>
          <textarea
            required
            rows={4}
            value={form.images}
            onChange={(event) => setForm((prev) => ({ ...prev, images: event.target.value }))}
            className="w-full rounded-xl border bg-background px-3 py-2 outline-none transition focus:border-foreground"
          />
        </label>

        <button
          disabled={loading}
          className="rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Product"}
        </button>

        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </form>
    </main>
  );
}
