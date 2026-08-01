import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Product, ProductFormData } from "@/types";

type CategorySelect = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

type ProductRecord = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  content: string;
  coverImage: string | null;
  gallery: string[];
  price: Prisma.Decimal | null;
  categoryId: string | null;
  status: string;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: CategorySelect | null;
};

function mapCategoryRef(
  category: CategorySelect | null | undefined,
  publicOnly: boolean
): Product["category"] {
  if (!category) return null;
  if (publicOnly && category.status !== "published") return null;
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

function mapProduct(product: ProductRecord, publicOnly = false): Product {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    shortDescription: product.shortDescription,
    content: product.content,
    coverImage: product.coverImage,
    gallery: product.gallery,
    price: product.price === null ? null : Number(product.price),
    categoryId: product.categoryId,
    category: mapCategoryRef(product.category, publicOnly),
    status: product.status as Product["status"],
    publishedAt: product.publishedAt,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function parsePrice(value?: string): Prisma.Decimal | null {
  if (!value?.trim()) return null;
  const normalized = value.trim().replace(",", ".");
  const number = Number(normalized);
  if (Number.isNaN(number) || number < 0) {
    throw new Error("Geçersiz fiyat değeri.");
  }
  return new Prisma.Decimal(normalized);
}

const productInclude = {
  category: { select: { id: true, name: true, slug: true, status: true } },
} as const;

export async function getPublishedProducts(limit?: number): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    include: productInclude,
    ...(limit && { take: limit }),
  });
  return products.map((product) => mapProduct(product, true));
}

export async function getPublishedProductsPage(
  page: number,
  perPage: number
): Promise<{ products: Product[]; total: number }> {
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * perPage;

  const [total, products] = await Promise.all([
    prisma.product.count({ where: { status: "published" } }),
    prisma.product.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      include: productInclude,
      skip,
      take: perPage,
    }),
  ]);

  return {
    products: products.map((product) => mapProduct(product, true)),
    total,
  };
}

export async function getPublishedProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { status: "published", categoryId },
    orderBy: { publishedAt: "desc" },
    include: productInclude,
  });
  return products.map((product) => mapProduct(product, true));
}

export async function getPublishedProductsByCategoryPage(
  categoryId: string,
  page: number,
  perPage: number
): Promise<{ products: Product[]; total: number }> {
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * perPage;
  const where = { status: "published" as const, categoryId };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: productInclude,
      skip,
      take: perPage,
    }),
  ]);

  return {
    products: products.map((product) => mapProduct(product, true)),
    total,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: productInclude,
  });
  return products.map((product) => mapProduct(product));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
  return product ? mapProduct(product, true) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  return product ? mapProduct(product) : null;
}

export async function getRelatedProducts(
  slug: string,
  categoryId: string | null,
  limit = 3
): Promise<Product[]> {
  const sameCategory = categoryId
    ? await prisma.product.findMany({
        where: {
          status: "published",
          slug: { not: slug },
          categoryId,
        },
        orderBy: { publishedAt: "desc" },
        take: limit,
        include: productInclude,
      })
    : [];

  if (sameCategory.length >= limit) {
    return sameCategory.map((product) => mapProduct(product, true));
  }

  const excludeSlugs = [slug, ...sameCategory.map((product) => product.slug)];

  const additional = await prisma.product.findMany({
    where: {
      status: "published",
      slug: { notIn: excludeSlugs },
    },
    orderBy: { publishedAt: "desc" },
    take: limit - sameCategory.length,
    include: productInclude,
  });

  return [...sameCategory, ...additional].map((product) =>
    mapProduct(product, true)
  );
}

export async function createProduct(data: ProductFormData): Promise<Product> {
  const product = await prisma.product.create({
    data: {
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription || null,
      content: data.content,
      coverImage: data.coverImage || null,
      gallery: data.gallery ?? [],
      price: parsePrice(data.price),
      categoryId: data.categoryId || null,
      status: data.status,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
    include: productInclude,
  });
  return mapProduct(product);
}

export async function updateProduct(
  id: string,
  data: ProductFormData
): Promise<Product> {
  const product = await prisma.product.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription || null,
      content: data.content,
      coverImage: data.coverImage || null,
      gallery: data.gallery ?? [],
      price: parsePrice(data.price),
      categoryId: data.categoryId || null,
      status: data.status,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
    include: productInclude,
  });
  return mapProduct(product);
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}
