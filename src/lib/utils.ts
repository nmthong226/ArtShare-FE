import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category } from "@/types/category";

export const convertCategory = (cat: any): Category => ({
  id: cat.id,
  name: cat.name,
  url: cat.url,
  createdAt: cat.createdAt,
});

export const mappedCategoryPost = (data: any) => ({
  ...data,
  categories: data.categories.map(convertCategory),
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
