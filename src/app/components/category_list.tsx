import { Category } from "./category_interface";


export default function CategoryList({ categories }: { categories: Category[];  }) {
    return (
        <div className="category-list">
            {categories.map((category) => (
                <div key={category._id} className="category-itemm">
                    <h2>{category.name}</h2>
                </div>
            ))}
        </div>
    );
}