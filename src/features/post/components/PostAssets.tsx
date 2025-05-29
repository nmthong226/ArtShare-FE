import { MediaDto } from "@/types";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const PostAssets = ({ medias }: { medias: MediaDto[] }) => {
  return (
    <PhotoProvider maskOpacity={0.9}>
      <div
        className={`flex flex-col items-center ${medias.length === 1 && "justify-center"} bg-white md:shadow rounded-2xl pb-4 md:h-full w-full overflow-y-auto no-scrollbar`}
      >
        {medias &&
          medias.map((media) => (
            <div
              key={media.url}
              className="flex justify-center md:px-4 pt-4 max-h-full hover:cursor-zoom-in"
            >
              <PhotoView src={media.url}>
                {media.media_type == "image" ? (
                  <img
                    src={media.url}
                    alt={media.description}
                    className="object-contain"
                  />
                ) : (
                  <video src={media.url} controls />
                )}
              </PhotoView>
            </div>
          ))}
      </div>
    </PhotoProvider>
  );
};

export default PostAssets;
