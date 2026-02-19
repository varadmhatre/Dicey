const STORAGE_KEY = "noir_store_products";

const seedProducts = [
  {
    id: crypto.randomUUID(),
    slug: "loose-fit-hoodie",
    title: "Loose Fit Hoodie",
    description: "Minimal premium hoodie with clean silhouette, soft brushed cotton, and monochrome details.",
    price: 2499,
    category: "Men Fashion",
    images: [
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1618677366787-9727aacca7ea?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
    ],
    redirect_url: "https://www.amazon.com/s?k=black+hoodie&tag=affiliate-id-20",
    reviews: [
      { author: "Alex Mathio", rating: 5, body: "Excellent fit and premium texture." },
      { author: "Nova R", rating: 4, body: "Great look, slightly oversized." }
    ]
  }
];

function readProducts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
    return seedProducts;
  }
  try { return JSON.parse(raw); } catch { return seedProducts; }
}

function writeProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function slugify(v) {
  return v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

window.NoirStore = { readProducts, writeProducts, slugify };
