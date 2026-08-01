export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string | null;
  author: string | null;
  status: "draft" | "published";
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  author?: string;
  status: "draft" | "published";
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: "draft" | "published";
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: { products: number };
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: "draft" | "published";
  sortOrder?: number;
}

export interface ProductCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  content: string;
  coverImage: string | null;
  gallery: string[];
  price: number | null;
  categoryId: string | null;
  category?: ProductCategoryRef | null;
  status: "draft" | "published";
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  title: string;
  slug: string;
  shortDescription?: string;
  content: string;
  coverImage?: string;
  gallery?: string[];
  price?: string;
  categoryId?: string;
  status: "draft" | "published";
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}
