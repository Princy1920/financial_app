import React, { useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Card, CardContent, Typography, Box, MenuItem } from '@mui/material';

export const EDIT_TRANSACTION_MUTATION = gql`
  mutation EditTransaction($id: ID!, $description: String, $category: String, $amount: Float, $date: String) {
    editTransaction(id: $id, description: $description, category: $category, amount: $amount, date: $date) {
      id
      description
      category
      amount
      date
    }
  }
`;

export const TRANSACTION_QUERY = gql`
  query Transaction($id: ID!) {
    transaction(id: $id) {
      id
      description
      category
      amount
      date
    }
  }
`;

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Expense');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');

  const { data } = useQuery(TRANSACTION_QUERY, {
    variables: { id }
  });

  const [editTransaction] = useMutation(EDIT_TRANSACTION_MUTATION);

  useEffect(() => {
    if (data) {
      const { transaction } = data;
      setDescription(transaction.description);
      setCategory(transaction.category);
      setAmount(transaction.amount);
      setDate(transaction.date);
    }
  }, [data]);

  const handleSaveTransaction = async () => {
    await editTransaction({ variables: { id, description, category, amount, date } });
    navigate('/transactions');
  };

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>Edit Transaction</Typography>
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
            />
            <Button variant="contained" color="primary" onClick={handleSaveTransaction} sx={{ mt: 2 }}>
              Save
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditTransaction;
