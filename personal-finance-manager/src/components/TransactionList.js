import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';
import {
  Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, IconButton, TextField, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const TRANSACTIONS_QUERY = gql`
  query Transactions($userId: ID!) {
    transactions(userId: $userId) {
      id
      description
      category
      amount
      date
    }
  }
`;

export const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 800,
  width: 800,
  margin: 'auto',
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  '& .MuiTableRow-root:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const RootContainer = styled(Container)(({ theme }) => ({
  marginTop: -100, // Adjust this as needed to reduce the space at the top
  marginBottom: theme.spacing(4),
  maxWidth: 1200,
  '& .MuiButton-root': {
    margin: theme.spacing(1),
  },
  '@media (min-width:600px)': {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

// Add a new styled component for spacing between the filters and the table
const FilterContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3), // This adds space between the filters and the table
}));

const TransactionListView = () => {
  const [transactions, setTransactions] = useState([]);
  const [view, setView] = useState('Income');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const user = JSON.parse(localStorage.getItem('user'));
  const { loading, error, data } = useQuery(TRANSACTIONS_QUERY, {
    variables: { userId: user.id },
  });
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION_MUTATION);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setTransactions(data.transactions);
    }
  }, [data]);

  const handleDelete = async (id) => {
    try {
      await deleteTransaction({ variables: { id } });
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/transaction/edit/${id}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const filteredTransactions = transactions.filter(
    (t) => {
      const transactionDate = new Date(t.date);
      return t.category === view &&
             t.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
             transactionDate.getMonth() + 1 === selectedMonth &&
             transactionDate.getFullYear() === selectedYear;
    }
  );

  return (
    <RootContainer maxWidth="lg">
    <Typography variant="h4" gutterBottom component="div" align="left">
      Transaction List
    </Typography>
    <Button onClick={() => setView('Income')} color="primary">
      Income
    </Button>
    <Button onClick={() => setView('Expense')} color="secondary">
      Expenses
    </Button>
    <TextField
      label="Search"
      variant="outlined"
      fullWidth
      margin="normal"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {Array.from(new Array(20), (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
    <Paper elevation={3}>
      <StyledTableContainer component={Paper}>
        <Table stickyHeader aria-label={`${view} transactions`}>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell component="th" scope="row">
                  {transaction.description}
                </TableCell>
                <TableCell align="right">{transaction.amount.toFixed(2)}</TableCell>
                <TableCell align="right">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleEdit(transaction.id)} color="primary" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(transaction.id)} color="error" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  </RootContainer>
  );
};

export default TransactionListView;
