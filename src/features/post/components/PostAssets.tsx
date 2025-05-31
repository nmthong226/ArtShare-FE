import { MediaDto } from "@/types";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const PostAssets = ({ medias }: { medias: MediaDto[] }) => {
  if (!medias || medias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full pb-4 text-gray-500 bg-white md:shadow rounded-2xl md:h-full">
        No assets available for this post.
      </div>
    );
  }

  return (
    <PhotoProvider maskOpacity={0.9}>
      <div
        className={`flex flex-col items-center ${medias.length === 1 && "justify-center"} bg-white dark:bg-mountain-950 md:shadow rounded-2xl pb-4 md:h-full w-full overflow-y-auto no-scrollbar`}
      >
        {medias.map((media) => (
          <div
            key={media.url}
            className="flex justify-center w-full max-h-full pt-4 md:px-4 hover:cursor-zoom-in"
          >
            <PhotoView src={media.url}>
              {media.media_type === "image" ? (
                <img
                  src={media.url}
                  alt={media.description || "Post asset"}
                  className="object-contain max-w-full max-h-[80vh] md:max-h-full"
                />
              ) : (
                <video
                  src={media.url}
                  controls
                  className="object-contain max-w-full max-h-[80vh] md:max-h-full"
                />
              )}
            </PhotoView>
          </div>
        ))}
      </div>
    </PhotoProvider>
  );
};

export default PostAssets;
