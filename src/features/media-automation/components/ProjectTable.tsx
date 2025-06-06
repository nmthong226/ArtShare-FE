import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import { IoFilter, IoTrashBin } from 'react-icons/io5';
import { Button } from '@mui/material';
import { getComparator } from '../utils/Utils';
import { useMemo, useState } from 'react';
import { Data, EnhancedTableProps, EnhancedTableToolbarProps, HeadCell, Order, SortableKeys } from '../types/automation-project';
import { ProjectData } from '../mocks/data';
import { generateSlug } from '@/utils/common';
import { useNavigate } from 'react-router-dom';

const headCells: readonly HeadCell[] = [
    {
        id: 'projectName',
        numeric: false,
        disablePadding: true,
        label: 'Project Name',
    },
    {
        id: 'platforms',
        numeric: true,
        disablePadding: false,
        label: 'Platforms',
    },
    {
        id: 'numberOfPosts',
        numeric: true,
        disablePadding: false,
        label: 'Post Number',
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'nextPostTime',
        numeric: true,
        disablePadding: false,
        label: 'Next Post Time',
    }
];

function ProjectTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: SortableKeys) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

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
                        sortDirection={orderBy === headCell.id ? order : false}
                        className='select-none'
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
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

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, dense, handleChangeDense } = props;
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
            className='flex justify-end'
        >
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <IoTrashBin />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <IoFilter />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}
export default function ProjectTable() {
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<SortableKeys>('projectName');
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRowClick = (row: Data) => {
        navigate(`/auto/${generateSlug(row.projectName)}/details`, { state: { row } });
    };

    const handleRequestSort = (
        _event: React.MouseEvent<unknown>,
        property: SortableKeys,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = ProjectData.map((n) => n.id);
            setSelected(newSelected);
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

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ProjectData.length) : 0;

    const visibleRows = useMemo(
        () =>
            [...ProjectData]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage],
    );

    return (
        <div className='flex border border-mountain-200 rounded-3xl w-full h-[calc(100vh-14rem)]'>
            <div className='flex flex-col justify-between w-full'>
                <div className='flex flex-col'>
                    <EnhancedTableToolbar numSelected={selected.length} dense={dense} handleChangeDense={handleChangeDense} />
                    <TableContainer className='flex-col justify-between h-full sidebar'>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <ProjectTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={ProjectData.length}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
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
                                            onClick={() => handleRowClick(row)}
                                            sx={{ cursor: 'pointer' }}
                                            className="hover:bg-mountain-50 border-mountain-100 border-b-2"
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
                                                {row.projectName}
                                            </TableCell>
                                            <TableCell align="right">
                                                <div className="flex flex-wrap justify-end gap-2">
                                                    {row.platforms.map((platform, index) => (
                                                        <div key={index} className="bg-mountain-100 px-2 py-1 rounded">
                                                            {platform}
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell align='right'>{row.numberOfPosts}</TableCell>
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
                                            <TableCell align="right">{row.nextPostTime ? row.nextPostTime.toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell align="right" className='space-x-2'>
                                                <Tooltip title="Edit">
                                                    <Button className='bg-indigo-50 border-1 border-mountain-200 font-normal'>Edit</Button>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <Button className='bg-red-50 border-1 border-mountain-200 font-normal'>Delete</Button>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={ProjectData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    className='overflow-hidden'
                />
            </div>
            {/* <ProjectDetailsModal
                openDiaLog={openDialog}
                setOpenDialog={setOpenDialog}
                selectedRow={selectedRow!}
            /> */}
        </div>
    );
}