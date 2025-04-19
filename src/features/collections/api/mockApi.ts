import { MEDIA_TYPE } from "@/constants";
import { Category, Collection, Post, User } from "@/types";
import { CreateCollectionFormData } from "../components/CreateCollectionDialog";

const mockUser: User = {
  id: "user123",
  username: "cool_dev",
  email: "dev@example.com",
  profile_picture_url: "https://via.placeholder.com/40",
  created_at: new Date(),
};

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Landscapes",
    url: "/topics/landscapes",
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Portraits",
    url: "/topics/portraits",
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Abstract",
    url: "/topics/abstract",
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Cityscapes",
    url: "/topics/cityscapes",
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "Nature Close-Ups",
    url: "/topics/nature-close-ups",
    createdAt: new Date(),
  },
  {
    id: 6,
    name: "Food Photography",
    url: "/topics/food",
    createdAt: new Date(),
  },
  {
    id: 7,
    name: "Wildlife",
    url: "/topics/wildlife",
    createdAt: new Date(),
  },
];

const post101: Post = {
  id: 101,
  title: "Mountain Sunrise",
  description: "A beautiful sunrise over the mountains.",
  is_published: true,
  is_private: false,
  like_count: 150,
  share_count: 20,
  comment_count: 15,
  created_at: new Date(Date.now() - 86400000 * 2),
  thumbnail_url:
    "https://plus.unsplash.com/premium_photo-1673240367277-e1d394465b56?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW91bnRhaW58ZW58MHx8MHx8fDA%3D",
  medias: [
    {
      id: 201,
      post_id: 101,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 50,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[0]],
};
const post102: Post = {
  id: 102,
  title: "City Lights",
  description: "Night view of the city.",
  is_published: true,
  is_private: false,
  like_count: 210,
  share_count: 35,
  comment_count: 25,
  created_at: new Date(Date.now() - 86400000),
  thumbnail_url:
    "https://images.unsplash.com/photo-1698907432487-f99fa6a91c0f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TmlnaHQlMjB2aWV3JTIwb2YlMjB0aGUlMjBjaXR5fGVufDB8fDB8fHww",
  medias: [
    {
      id: 202,
      post_id: 102,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 70,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[3]],
};

const post103: Post = {
  id: 103,
  title: "Studio Portrait",
  description: "A professional portrait shot.",
  is_published: true,
  is_private: false,
  like_count: 95,
  share_count: 10,
  comment_count: 8,
  created_at: new Date(),
  thumbnail_url:
    "https://images.unsplash.com/photo-1620500152438-b303ab1e73c1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTMyfHxBJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBzaG90fGVufDB8fDB8fHww",
  medias: [
    {
      id: 203,
      post_id: 103,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 30,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[1]],
};
const post104: Post = {
  id: 104,
  title: "Abstract Forms",
  description: "Exploring shapes and colors.",
  is_published: true,
  is_private: false,
  like_count: 55,
  share_count: 5,
  comment_count: 3,
  created_at: new Date(Date.now() - 86400000 * 3),
  thumbnail_url:
    "https://plus.unsplash.com/premium_photo-1671019879191-a695376b6d61?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fEV4cGxvcmluZyUyMHNoYXBlcyUyMGFuZCUyMGNvbG9yc3xlbnwwfHwwfHx8MA%3D%3D",
  medias: [
    {
      id: 204,
      post_id: 104,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 20,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[2]],
};
const post105: Post = {
  id: 105,
  title: "Downtown Evening",
  description: "City street at dusk.",
  is_published: true,
  is_private: false,
  like_count: 180,
  share_count: 28,
  comment_count: 19,
  created_at: new Date(Date.now() - 86400000 * 4),
  thumbnail_url:
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2l0eSUyMHN0cmVldCUyMGF0JTIwZHVza3xlbnwwfHwwfHx8MA%3D%3D",
  medias: [
    {
      id: 205,
      post_id: 105,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 65,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[3]],
};
const post106: Post = {
  id: 106,
  title: "Forest Path",
  description: "A quiet path through the woods.",
  is_published: true,
  is_private: false,
  like_count: 120,
  share_count: 15,
  comment_count: 10,
  created_at: new Date(Date.now() - 86400000 * 6),
  thumbnail_url:
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=700&auto=format&fit=crop&q=60",
  medias: [
    {
      id: 206,
      post_id: 106,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 45,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[0], mockCategories[4]],
};
const post107: Post = {
  id: 107,
  title: "Tropical Beach",
  description: "Relaxing view of a sandy beach.",
  is_published: true,
  is_private: false,
  like_count: 300,
  share_count: 50,
  comment_count: 40,
  created_at: new Date(Date.now() - 86400000 * 5),
  thumbnail_url:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&auto=format&fit=crop&q=60",
  medias: [
    {
      id: 207,
      post_id: 107,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 90,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[0]],
};
const post108: Post = {
  id: 108,
  title: "Monochrome Lines",
  description: "Black and white architectural detail.",
  is_published: true,
  is_private: false,
  like_count: 80,
  share_count: 8,
  comment_count: 5,
  created_at: new Date(Date.now() - 86400000 * 4),
  thumbnail_url:
    "https://plus.unsplash.com/premium_photo-1673621329410-e4ef5df05b69?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8QmxhY2slMjAlMjYlMjBXaGl0ZXxlbnwwfHwwfHx8MA%3D%3D",
  medias: [
    {
      id: 208,
      post_id: 108,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 25,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[2], mockCategories[3]],
};
const post109: Post = {
  id: 109,
  title: "Gourmet Burger",
  description: "A delicious looking burger.",
  is_published: true,
  is_private: false,
  like_count: 110,
  share_count: 18,
  comment_count: 12,
  created_at: new Date(Date.now() - 86400000 * 3),
  thumbnail_url:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=60",
  medias: [
    {
      id: 209,
      post_id: 109,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 40,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[5]],
};
const post110: Post = {
  id: 110,
  title: "Sleeping Cat",
  description: "Cute cat taking a nap.",
  is_published: true,
  is_private: false,
  like_count: 450,
  share_count: 80,
  comment_count: 60,
  created_at: new Date(Date.now() - 86400000 * 2),
  thumbnail_url:
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=700&auto=format&fit=crop&q=60",
  medias: [
    {
      id: 210,
      post_id: 110,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 150,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[1], mockCategories[6]],
};
const post111: Post = {
  id: 111,
  title: "Desert Dunes",
  description: "Vast desert landscape.",
  is_published: true,
  is_private: false,
  like_count: 90,
  share_count: 12,
  comment_count: 7,
  created_at: new Date(Date.now() - 86400000 * 7),
  thumbnail_url:
    "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=700&auto=format&fit=crop&q=60",
  medias: [
    {
      id: 211,
      post_id: 111,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 35,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[0]],
};
const post112: Post = {
  id: 112,
  title: "Eagle in Flight",
  description: "Majestic bird soaring.",
  is_published: true,
  is_private: false,
  like_count: 250,
  share_count: 45,
  comment_count: 30,
  created_at: new Date(Date.now() - 86400000 * 1),
  thumbnail_url:
    "https://plus.unsplash.com/premium_photo-1698524852430-6a9654e26940?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZWFnbGUlMjBpbiUyMGZsaWdodHxlbnwwfHwwfHx8MA%3D%3D",
  medias: [
    {
      id: 212,
      post_id: 112,
      media_type: MEDIA_TYPE.IMAGE,
      url: "...",
      creator_id: mockUser.id,
      downloads: 85,
      created_at: new Date(),
    },
  ],
  user: mockUser,
  categories: [mockCategories[6]],
};

export const mockCollections: Collection[] = [
  {
    id: 1,
    name: "Amazing Vistas",
    description: "Collection of breathtaking landscape shots.",
    is_private: false,
    user_id: mockUser.id,
    created_at: new Date(Date.now() - 86400000 * 15),
    updated_at: new Date(),
    posts: [post101, post111],
  },
  {
    id: 2,
    name: "Urban Exploration",
    description: "Capturing the essence of city life.",
    is_private: false,
    user_id: mockUser.id,
    created_at: new Date(Date.now() - 86400000 * 10),
    updated_at: new Date(),
    posts: [post102, post105],
  },
  {
    id: 3,
    name: "Creative Experiments",
    is_private: false,
    user_id: mockUser.id,
    created_at: new Date(Date.now() - 86400000 * 8),
    updated_at: new Date(),
    posts: [post104],
  },
  {
    id: 4,
    name: "Portraits Showcase",
    description: "Collection for portrait photography.",
    is_private: false,
    user_id: mockUser.id,
    created_at: new Date(Date.now() - 86400000 * 6),
    updated_at: new Date(),
    posts: [post103],
  },

  {
    id: 5,
    name: "Nature's Details",
    description: "Close-up shots from the natural world.",
    is_private: false,
    user_id: mockUser.id,
    created_at: new Date(Date.now() - 86400000 * 5),
    updated_at: new Date(),
    posts: [post106],
  },
  {
    id: 6,
    name: "Sunny Beaches",
    description: "Views from sandy shores.",
    is_private: false,
    user_id: mockUser.id,
    created_at: new Date(Date.now() - 86400000 * 4),
    updated_at: new Date(),
    posts: [post107],
  },
  {
    id: 7,
    name: "Black & White",
    description: "Monochromatic perspectives.",
    is_private: false,
    user_id: mockUser.id,
    created_at: new Date(Date.now() - 86400000 * 3),
    updated_at: new Date(),
    posts: [post108],
  },
  {
    id: 8,
    name: "Foodie Pics",
    is_private: false,
    user_id: mockUser.id,
    created_at: new Date(Date.now() - 86400000 * 2),
    updated_at: new Date(),
    posts: [post109],
  },
  {
    id: 9,
    name: "Animal Friends",
    description: "Adorable pets and wildlife.",
    is_private: false,
    user_id: mockUser.id,
    created_at: new Date(Date.now() - 86400000 * 1),
    updated_at: new Date(),
    posts: [post110, post112],
  },
  {
    id: 10,
    name: "Minimalist Mood",
    is_private: false,
    user_id: mockUser.id,
    created_at: new Date(Date.now() - 86400000 * 0.5),
    updated_at: new Date(),
    posts: [post104],
  },
];

export const mockUnassignedPosts: Post[] = [post103];

export const fetchCollectionsWithPosts = async (): Promise<Collection[]> => {
  console.log("Fetching collections with embedded posts...");
  await new Promise((resolve) => setTimeout(resolve, 600));

  const collectionsWithSortedPosts = mockCollections.map((collection) => ({
    ...collection,
    posts: [...collection.posts].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ),
  }));

  return collectionsWithSortedPosts.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
};

export const renameCollection = async (
  collectionId: number,
  newName: string,
): Promise<Collection> => {
  console.log(`API: Renaming collection ${collectionId} to "${newName}"`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const updatedCollection = mockCollections.find((c) => c.id === collectionId);
  if (!updatedCollection) {
    throw new Error("Collection not found");
  }
  updatedCollection.name = newName;
  console.log("API: Rename successful", updatedCollection);
  return { ...updatedCollection };
};

export const removePostFromCollection = async (
  collectionId: number,
  postId: number,
): Promise<void> => {
  console.log(`API: Removing post ${postId} from collection ${collectionId}`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  const collection = mockCollections.find((c) => c.id === collectionId);
  if (!collection) {
    throw new Error("Collection not found");
  }

  const initialLength = collection.posts.length;
  collection.posts = collection.posts.filter((p) => p.id !== postId);

  if (collection.posts.length === initialLength) {
    console.warn(
      `API: Post ${postId} was not found in collection ${collectionId}`,
    );
  } else {
    console.log(`API: Post ${postId} removed successfully.`);
  }

  return Promise.resolve();
};

export const createCollection = async (
  data: CreateCollectionFormData,
): Promise<Collection> => {
  console.log(
    `API: Simulating creation of collection '${data.name}' (Private: ${data.isPrivate})`,
  );
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (data.name.toLowerCase().includes("fail")) {
    console.error(
      "API: Simulated failure for collection name containing 'fail'",
    );
    throw new Error("Simulated API error: Invalid collection name.");
  }

  const maxId = mockCollections.reduce((max, col) => Math.max(max, col.id), 0);
  const newId = maxId + 1;

  const newCollection: Collection = {
    id: newId,
    name: data.name.trim(),
    is_private: data.isPrivate,
    user_id: mockUser.id,
    posts: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  mockCollections.push(newCollection);

  mockCollections.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  console.log(
    "API: Simulated creation success. New collection added:",
    newCollection,
  );

  return { ...newCollection };
};
