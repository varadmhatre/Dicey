import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { slug: string };
};

export default async function ProductDetailsPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      reviews: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
    },
  });

  if (!product || product.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-6 py-10 md:grid-cols-2">
      <section className="space-y-3">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-[540px] w-full rounded-2xl border object-cover"
        />
        <div className="grid grid-cols-4 gap-3">
          {product.images.slice(0, 4).map((image) => (
            <img key={image} src={image} alt={product.title} className="h-24 w-full rounded-xl border object-cover" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <p className="inline-block rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]">{product.category}</p>
        <h1 className="font-display text-4xl">{product.title}</h1>
        <p className="text-3xl font-semibold">${(product.priceInCents / 100).toFixed(2)}</p>
        <p className="max-w-xl text-muted-foreground">{product.description}</p>

        <div className="flex gap-3">
          <button className="rounded-full border px-6 py-3 text-sm">Add to Cart</button>
          <a
            href={product.redirectUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-full border border-black bg-black px-8 py-3 text-sm text-white transition hover:bg-white hover:text-black"
          >
            Buy Now on Amazon
          </a>
        </div>

        <section className="space-y-3 border-t pt-6">
          <h2 className="font-display text-2xl">Recent Reviews</h2>
          {product.reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            product.reviews.map((review) => (
              <article key={review.id} className="rounded-xl border p-4">
                <p className="text-sm font-medium">{review.user.name ?? "Verified Buyer"}</p>
                <p className="text-xs text-muted-foreground">{review.rating}/5</p>
                <p className="mt-2 text-sm">{review.body}</p>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
