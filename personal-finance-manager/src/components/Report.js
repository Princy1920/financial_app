import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Box,
  IconButton
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
  maxHeight: 400,
  width: '100%',
  margin: 'auto',
  overflowY: 'auto',
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  '& .MuiTableRow-root:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,

  },
}));

const RootContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  maxWidth: 1200,
  backgroundColor: 'white',
  '& .MuiButton-root': {
    margin: theme.spacing(1),
  },
  '& .MuiSelect-select': {
    paddingRight: '154px',
  },
  '@media (min-width:600px)': {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const BalanceBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const Report = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));
  const { loading, error, data } = useQuery(TRANSACTIONS_QUERY, {
    variables: { userId: user.id }
  });
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION_MUTATION, {
    refetchQueries: [{ query: TRANSACTIONS_QUERY, variables: { userId: user.id } }]
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setTransactions(data.transactions);
      calculateBalance(data.transactions);
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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    filterTransactions(event.target.value, selectedYear);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    filterTransactions(selectedMonth, event.target.value);
  };

  const filterTransactions = (month, year) => {
    if (data) {
      const filteredTransactions = data.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() + 1 === parseInt(month) && transactionDate.getFullYear() === parseInt(year);
      });
      setTransactions(filteredTransactions);
      calculateBalance(filteredTransactions);
    }
  };

  const calculateBalance = (transactions) => {
    const incomeTransactions = transactions.filter(t => t.category === 'Income');
    const expenseTransactions = transactions.filter(t => t.category === 'Expense');

    const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    setIncome(totalIncome);
    setExpenses(totalExpenses);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const months = Array.from({ length: 12 }, (v, k) => k + 1);
  const years = Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k);

  return (
    <RootContainer maxWidth="lg">
      <Typography variant="h4" gutterBottom component="div" align="center">
        Transaction Report
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
  <Grid item>
    <FormControl variant="outlined" sx={{ minWidth: 150 }}>
      <InputLabel id="month-label">Select Month</InputLabel>
      <Select
        labelId="month-label"
        id="month"
        value={selectedMonth}
        onChange={handleMonthChange}
        label="Select Month"
      >
        <MenuItem value="">
          <em>Month</em>
        </MenuItem>
        {months.map(month => (
          <MenuItem key={month} value={month}>{month}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
  <Grid item>
    <FormControl variant="outlined" sx={{ minWidth: 150 }}>
      <InputLabel id="year-label">Select Year</InputLabel>
      <Select
        labelId="year-label"
        id="year"
        value={selectedYear}
        onChange={handleYearChange}
        label="Select Year"
      >
        <MenuItem value="">
          <em>Year</em>
        </MenuItem>
        {years.map(year => (
          <MenuItem key={year} value={year}>{year}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
</Grid>
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <Paper elevation={3}>
      <Typography variant="h6" align="center">
        Income
      </Typography>
      <StyledTableContainer component={Paper}>
        <Table stickyHeader aria-label="Income transactions" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.filter(t => t.category === 'Income').map(transaction => (
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
  </Grid>
  <Grid item xs={12} md={6}>
    <Paper elevation={3}>
      <Typography variant="h6" align="center">
        Expenses
      </Typography>
      <StyledTableContainer component={Paper}>
        <Table stickyHeader aria-label="Expense transactions" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.filter(t => t.category === 'Expense').map(transaction => (
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
  </Grid>
</Grid>

      <BalanceBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Total Income: {income.toFixed(2)}
        </Typography>
        <Typography variant="h6" component="div">
          Total Expenses: {expenses.toFixed(2)}
        </Typography>
        <Typography variant="h6" component="div">
          Balance: {(income - expenses).toFixed(2)}
        </Typography>
      </BalanceBox>
    </RootContainer>
  );
};

export default Report;
