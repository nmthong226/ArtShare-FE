import { AutoPost, Data, PostStatus } from "../types/automation-project";

export function createData(
  id: number,
  projectName: string,
  platforms: string[],
  numberOfPosts: number,
  status: PostStatus,
  nextPostTime: Date | null,
  posts: AutoPost[],
): Data {
  return {
    id,
    projectName,
    platforms,
    numberOfPosts,
    status,
    nextPostTime,
    posts,
  };
}
