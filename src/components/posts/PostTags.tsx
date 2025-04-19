import { Category } from "@/types/category";

interface PostTagsProps {
  categories: Category[];
}

const PostTags: React.FC<PostTagsProps> = ({ categories }) => {
  return (
    <div className="flex flex-col gap-4 bg-white px-4 py-6 rounded-2xl">
      <div className="font-bold text-xl">Categories</div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-mountain-50 px-2 py-1 rounded text-xs"
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostTags;
