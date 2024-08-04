import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, MenuItem, Button, Card, CardContent, Typography, Box } from '@mui/material';

export const ADD_TRANSACTION_MUTATION = gql`
  mutation AddTransaction($userId: ID!, $description: String!, $category: String!, $amount: Float!, $date: String!) {
    addTransaction(userId: $userId, description: $description, category: $category, amount: $amount, date: $date) {
      id
      description
      category
      amount
      date
    }
  }
`;

const AddEditTransaction = () => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Income');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');
  const navigate = useNavigate();
  const [addTransaction, { error }] = useMutation(ADD_TRANSACTION_MUTATION);

  const handleAddTransaction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await addTransaction({ variables: { userId: user.id, description, category, amount, date } });
      navigate('/transactions');
      window.location.reload();
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>Add Transaction</Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              margin="normal"
            >
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </TextField>
            <TextField
              type="number"
              fullWidth
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              margin="normal"
            />
            <TextField
              type="date"
              fullWidth
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" color="primary" onClick={handleAddTransaction} sx={{ mt: 2 }}>
              Save
            </Button>
          </Box>
          {error && <Typography color="error">Error adding transaction. Please try again.</Typography>}
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddEditTransaction;
