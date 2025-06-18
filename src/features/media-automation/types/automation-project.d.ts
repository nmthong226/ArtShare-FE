export type Order = "asc" | "desc";

export type SortableKeys =
  | keyof Pick<AutoProject, "title" | "status" | "nextPostAt">
  | "autoPosts";

export interface HeadCell {
  id: SortableKeys | "platforms" | "actions";
  label: string;
  numeric: boolean;
  disablePadding: boolean;
  isSortable: boolean;
}

type PostStatus = "canceled" | "draft" | "scheduled" | "active";

interface Data {
  id: number;
  projectName: string;
  platforms: string[];
  numberOfPosts: number;
  status: PostStatus;
  nextPostTime: Date | null;
  posts?: AutoPost[] | null;
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: SortableKeys,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  dense: boolean;
  handleChangeDense: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

type PostStatus = "draft" | "scheduled" | "posted" | "canceled";

type AutoPost = {
  id: number;
  content: string;
  imageUrl?: string[];
  status: PostStatus;
  createdAt: Date;
  scheduledTime?: Date;
};

type AutomationProjectDetail = {
  id: number;
  name: string;
  platforms: string[];
  status: PostStatus;
  posts: AutoPost[];
};

interface ItemTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: SortableKeysItemTable,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

type SortableKeysItemTable = Exclude<keyof AutoPost>;

interface HeadCellItemTable {
  disablePadding: boolean;
  id: SortableKeysItemTable;
  label: string;
  numeric: boolean;
}

interface GenPostContent {
  id: number;
  title: string;
  content: string;
  images?: string[];
  hashtags?: string[];
}

export interface AutoPostMeta {
  scheduled_at: Date;
  images_count: number;
}

export interface CreateAutoProjectPayload {
  title: string;
  description: string;
  platform_id: number;
  auto_post_meta_list: AutoPostMeta[];
}

export interface AutoProject {
  id: number;
  title: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "FAILED";
  platforms: {
    platform: {
      id: number;
      name: "FACEBOOK" | "INSTAGRAM";
    };
  }[];
  _count: {
    autoPosts: number;
  };

  nextPostAt: string | null;
}

export interface ProjectSummaryStats {
  active: number;
  completed: number;
  cancelledOrFailed: number;
}
