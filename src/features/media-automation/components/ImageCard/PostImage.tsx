import { Edit, Trash2 } from "lucide-react";

export const PostImage = ({ src, index }: { src: string; index: number }) => (
    <div className="group relative bg-white rounded-md w-full aspect-video overflow-hidden">
        <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
        <div className="hidden top-2 right-2 absolute group-hover:flex bg-white p-2 rounded-full cursor-pointer">
            <Edit className="size-4" />
        </div>
        <div className="hidden right-2 bottom-2 absolute group-hover:flex bg-white p-2 rounded-full cursor-pointer">
            <Trash2 className="size-4" />
        </div>
    </div>
);