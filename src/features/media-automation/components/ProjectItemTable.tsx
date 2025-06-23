import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';
import { useState } from 'react';
import { Data, HeadCellItemTable, ItemTableProps, Order, SortableKeysItemTable } from '../types/automation-project';
import { useNavigate } from 'react-router-dom';
import { generateSlug } from '@/utils/common';

const headCells: readonly HeadCellItemTable[] = [
    {
        id: 'content',
        numeric: false,
        disablePadding: true,
        label: 'Content',
    },
    {
        id: 'imageUrl',
        numeric: true,
        disablePadding: false,
        label: 'Images Number',
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'scheduledTime',
        numeric: true,
        disablePadding: false,
        label: 'Scheduled Time',
    },
    {
        id: 'createdAt',
        numeric: true,
        disablePadding: false,
        label: 'Created At',
    },
];

function ProjectTableHead(props: ItemTableProps) {
    const { onSelectAllClick, numSelected, rowCount } = props;

    return (
        <TableHead>
            <TableRow className='border-mountain-100 border-b-2'>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        className='select-none'
                    >
                        {headCell.label}
                    </TableCell>
                ))}
                <TableCell
                    key={'actions'}
                    align={'right'}
                    className='select-none'
                >
                    Actions
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

const ProjectItemTable = ({ selectedRow }: { selectedRow: Data }) => {
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<SortableKeysItemTable>('content');
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [page] = useState(0);
    const [rowsPerPage] = useState(7);
    const navigate = useNavigate();

    const handleRequestSort = (
        _event: React.MouseEvent<unknown>,
        property: SortableKeysItemTable,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = selectedRow.posts?.map((n) => n.id);
            setSelected(newSelected!);
            return;
        }
        setSelected([]);
    };

    const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (selectedRow.posts ? selectedRow.posts.length : 0)) : 0;

    const handleAddPostClick = () => {
        if (!selectedRow) return;
        const slug = generateSlug(selectedRow.title || 'project');

        navigate(`/auto/${slug}/posts/new`);
    }

    return (
        <div className='flex border border-mountain-200 rounded-3xl w-full'>
            <div className='flex flex-col justify-between w-full'>
                <div className='flex flex-col'>
                    {selectedRow && (
                        <TableContainer className='flex-col justify-between h-full sidebar'>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size={'medium'}
                            >
                                <ProjectTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={selectedRow.posts ? selectedRow.posts.length : 0}
                                />
                                <TableBody>
                                    {selectedRow.posts && selectedRow.posts.map((row, index) => {
                                        const isItemSelected = selected.includes(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                                sx={{ cursor: 'pointer' }}
                                                className="hover:bg-mountain-50 border-mountain-100 border-b-2 last:border-b-0 h-12"
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        onClick={(event) => handleClick(event, row.id)}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    className=''
                                                >
                                                    {row.content}
                                                </TableCell>
                                                <TableCell align='right'>{row.imageUrl?.length || 0}</TableCell>
                                                <TableCell align="right">
                                                    <span className="flex justify-end items-center gap-2 text-sm">
                                                        <span
                                                            className={`w-2 h-2 rounded-full
                                                            ${row.status === 'draft'
                                                                    ? 'bg-gray-500'
                                                                    : row.status === 'scheduled'
                                                                        ? 'bg-yellow-500'
                                                                        : row.status === 'active'
                                                                            ? 'bg-green-500'
                                                                            : row.status === 'canceled'
                                                                                ? 'bg-red-500'
                                                                                : 'bg-gray-300'
                                                                }`}
                                                        ></span>
                                                        <span className='capitalize'>
                                                            {row.status}
                                                        </span>
                                                    </span>
                                                </TableCell>
                                                <TableCell align="right">{row.scheduledTime ? row.scheduledTime.toLocaleDateString() : 'N/A'}</TableCell>
                                                <TableCell align='right'>{row.createdAt.toLocaleDateString()}</TableCell>
                                                <TableCell align="right" className='space-x-2'>
                                                    <Tooltip title="Edit">
                                                        <Button className='bg-indigo-50 p-0 border-1 border-mountain-200 font-normal'>Edit</Button>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <Button className='bg-red-50 p-0 border-1 border-mountain-200 font-normal'>Delete</Button>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {selectedRow.posts && selectedRow.posts.length < 7 && (
                                        <TableRow
                                            sx={{ cursor: 'pointer' }}
                                            className="hover:bg-mountain-50 border-mountain-100 border-b-2 last:border-b-0 h-12"
                                            onClick={() => console.log('Add post clicked')} // Replace with your add logic
                                        >
                                            <TableCell colSpan={7} align="center">
                                                <Button onClick={() => handleAddPostClick()} variant="outlined" color="primary" className='bg-white border-mountain-200 w-48 text-mountain-950'>
                                                    + Add Post
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: 42 * emptyRows,
                                            }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectItemTable