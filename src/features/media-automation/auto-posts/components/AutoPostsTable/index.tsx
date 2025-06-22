import { useGetProjectDetails } from '@/features/media-automation/projects/hooks/useGetProjectDetails';
import { getStatusChipProps } from '@/features/media-automation/projects/utils';
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Order,
  SortableKeysItemTable,
} from '../../../projects/types/automation-project';
import { useGetAutoPosts } from '../../hooks/useGetAutoPosts';
import PostsTableHeader from './AutoPostsTableHeader';

const AutoPostsTable = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<SortableKeysItemTable>('content');
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page] = useState(1);
  const [rowsPerPage] = useState(7);
  const navigate = useNavigate();

  const { data: projectDetails } = useGetProjectDetails(projectId);

  if (!projectDetails) {
    return <div>Loading project details...</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: fetchedPostsResponse } = useGetAutoPosts({
    projectId: projectDetails?.id,
    orderBy,
    order,
    page,
    limit: rowsPerPage,
  });

  const posts = fetchedPostsResponse?.data ?? [];

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
      const newSelected = posts.map((n) => n.id);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - posts.length) : 0;

  const handleAddPostClick = () => {
    navigate(`/auto/projects/${projectDetails.id}/posts/new`);
  };

  return (
    <div className="flex-1 w-full flex flex-col">
      <div className="flex w-full">
        <p>Number Of Posts: {posts.length}</p>
      </div>
      <div className="flex border border-mountain-200 rounded-3xl w-full">
        <div className="flex flex-col justify-between w-full">
          <div className="flex flex-col">
            <TableContainer className="flex-col justify-between h-full sidebar">
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={'medium'}
              >
                <PostsTableHeader
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={posts.length}
                />
                <TableBody>
                  {posts.map((row, index) => {
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
                          className=""
                        >
                          {row.content}
                        </TableCell>
                        <TableCell align="right">
                          {row.imageUrl?.length || 0}
                        </TableCell>
                        <TableCell align="right">
                          <span className="flex justify-end items-center gap-2 text-sm">
                            <span
                              className={`w-2 h-2 rounded-full${getStatusChipProps(row.status)}`}
                            ></span>
                            <span className="capitalize">{row.status}</span>
                          </span>
                        </TableCell>
                        <TableCell align="right">
                          {row.scheduledTime
                            ? row.scheduledTime.toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell align="right">
                          {row.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right" className="space-x-2">
                          <Tooltip title="Edit">
                            <Button className="bg-indigo-50 p-0 border-1 border-mountain-200 font-normal">
                              Edit
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button className="bg-red-50 p-0 border-1 border-mountain-200 font-normal">
                              Delete
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {posts.length < 7 && (
                    <TableRow
                      sx={{ cursor: 'pointer' }}
                      className="hover:bg-mountain-50 border-mountain-100 border-b-2 last:border-b-0 h-12"
                      onClick={() => console.log('Add post clicked')} // Replace with your add logic
                    >
                      <TableCell colSpan={7} align="center">
                        <Button
                          onClick={() => handleAddPostClick()}
                          variant="outlined"
                          color="primary"
                          className="bg-white border-mountain-200 w-48 text-mountain-950"
                        >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoPostsTable;
