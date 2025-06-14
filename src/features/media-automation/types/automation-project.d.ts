import { Dispatch, SetStateAction } from "react";

export type Order = "asc" | "desc";

export type SortableKeys =
  | keyof Pick<AutoProject, "title" | "status" | "nextPostAt">
  | "autoPosts";

export interface HeadCell {
  id: SortableKeys | "platforms" | "actions"; // The unique ID for the column. Can be non-sortable.
  label: string;
  numeric: boolean;
  disablePadding: boolean;
  isSortable: boolean; // Flag to control if the column should have sorting UI.
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

type ProjectDialogProps = {
  openDiaLog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  selectedRow: Data;
};

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
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "FAILED"; // Matches Prisma Enum
  platforms: {
    platform: {
      id: number;
      name: "FACEBOOK" | "INSTAGRAM"; // Matches Prisma Enum
    };
  }[];
  _count: {
    autoPosts: number;
  };
  // Assuming your backend can determine the next post time
  nextPostAt: string | null;
}

export interface ProjectSummaryStats {
  active: number;
  completed: number;
  cancelledOrFailed: number;
}
