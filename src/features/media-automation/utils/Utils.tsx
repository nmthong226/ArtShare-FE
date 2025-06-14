import { AutoPost, Data, Order, PostStatus, SortableKeys } from "../types/automation-project";

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator<Key extends SortableKeys>(
    order: Order,
    orderBy: Key,
): (
    a: Pick<Data, SortableKeys>,
    b: Pick<Data, SortableKeys>,
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

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
        posts
    };
}
