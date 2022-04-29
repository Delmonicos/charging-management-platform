import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, customers, ...rest }) => {
  const classes = useStyles();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  User Id
                </TableCell>
                <TableCell>
                  Total Sessions Number
                </TableCell>
                <TableCell>
                  Total kwh
                </TableCell>
                <TableCell>
                  Total amount
                </TableCell>
                <TableCell>
                  Total duration
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers && customers.slice(0, limit).map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    {customer.id}
                  </TableCell>
                  <TableCell>
                    {customer.nb_sessions}
                  </TableCell>
                  <TableCell>
                    {`${customer.total_kwh} kwh`}
                  </TableCell>
                  <TableCell>
                    {
                      new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 2
                      }).format(customer.total_amount)
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(1000 * customer.total_duration).toISOString().substring(11, 19)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      {customers && (
        <TablePagination
          component="div"
          count={customers.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      )}
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  customers: PropTypes.array.isRequired
};

export default Results;
