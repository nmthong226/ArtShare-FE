import { Dispatch, SetStateAction } from "react";

type Order = 'asc' | 'desc';

type SortableKeys = Exclude<keyof Data, 'posts'>;

interface HeadCell {
    disablePadding: boolean;
    id: SortableKeys;
    label: string;
    numeric: boolean;
}

type PostStatus = 'canceled' | 'draft' | 'scheduled' | 'active';

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
    onRequestSort: (event: React.MouseEvent<unknown>, property: SortableKeys) => void;
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
}

type PostStatus = 'draft' | 'scheduled' | 'posted' | 'canceled';

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

// Project Item Table

interface ItemTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: SortableKeysItemTable) => void;
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
