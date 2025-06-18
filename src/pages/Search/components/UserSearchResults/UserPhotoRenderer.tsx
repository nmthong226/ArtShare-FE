import { RenderPhotoContext } from "react-photo-album";

import { UserPhoto } from "../../types";
import { Link } from "react-router-dom";

export const UserPhotoRenderer = (
  _: unknown,
  context: RenderPhotoContext<UserPhoto>,
) => {
  const { photo, height, width, index } = context;

  return (
    <div
      className="relative overflow-hidden rounded-lg cursor-pointer group"
      style={{
        height: height,
        width: width,
      }}
    >
      <Link to={`/${photo.username}`} className="block w-full h-full">
        <img
          {...photo}
          srcSet={
            Array.isArray(photo.srcSet) ? photo.srcSet.join(", ") : photo.srcSet
          }
          alt={photo.alt || `Image ${index}`}
          className="w-full h-full object-cover rounded-lg"
        />

        {/* Info Overlay (visible on hover) */}
        <div className="absolute inset-0 z-10 flex flex-col items-start justify-end p-4 text-white transition-opacity duration-300 rounded-lg opacity-0 bg-gradient-to-b from-transparent via-transparent to-black/70 group-hover:opacity-100">
          <div className="flex items-end justify-between w-full gap-2">
            <div title={`${photo.fullName}\n${photo.username}`}>
              <span className="text-sm font-semibold line-clamp-1">
                {photo.fullName}
              </span>
              <span className="text-xs line-clamp-1">{photo.username}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
