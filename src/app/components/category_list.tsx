import { Category } from "./category_interface";
import Link from "next/link";

export default function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div className="category-list">
      {categories.map((category) => (
        <div key={category._id} className="category-itemm">
          <Link href={`/user/product?category=${encodeURIComponent(category.name)}`}>
            <h2>{category.name}</h2>
          </Link>
        </div>
      ))}
    </div>
  );
}