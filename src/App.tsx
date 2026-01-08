import React from "react";
import "./App.css";
import {
  Box,
  Button,
  Card,
  CardHeader,
  colors,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Stores, User, addData, deleteData, getData, getStoreData, initDB, updateData } from './db/db';
import { Category, CategoryKey, Expense } from "./global";
import moment from "moment";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

/* =====================
   Types
===================== */

/* =====================
   Config
===================== */

const CATEGORIES: Category[] = [
  { key: "food", label: "Food", color: "#F5AD27" },
  { key: "transport", label: "Transport", color: "#ED2D8A" },
  { key: "entertainment", label: "Entertainment", color: "#F56827" },
  { key: "travel", label: "Travel", color: "#F53C27" },
  { key: "other", label: "Other", color: "#27BEF5" },
];

export default function App(): JSX.Element {
  /* =====================
     Form state
  ===================== */

  const [expenseType, setExpenseType] = React.useState<CategoryKey | "">("");
  const [expenseName, setExpenseName] = React.useState<string>("");
  const [id, setId] = React.useState<number | null>(null);
  const [amount, setAmount] = React.useState<string>("");
  const [isDBReady, setIsDBReady] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [users, setUsers] = React.useState<User[] | []>([]);

  const handleInitDB = async () => {
    const status = await initDB();
    setIsDBReady(!!status);
    function sleep(ms: any) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // waits for 2000ms
    await sleep(2000);
  };

  /* =====================
     Data state
  ===================== */

  const [expenses, setExpenses] = React.useState<Expense[]>([]);

  /* =====================
     Derived totals
  ===================== */

  const { totalsByType, totalAmount, percentages } = React.useMemo(() => {
    const totals: Record<CategoryKey, number> = {
      food: 0,
      transport: 0,
      entertainment: 0,
      travel: 0,
      other: 0,
    };

    let total = 0;

    for (const exp of expenses) {
      total += exp.amount;
      totals[exp?.expenseType] += exp.amount;
    }

    const pct: Record<CategoryKey, string> = {
      food: "0.00",
      transport: "0.00",
      entertainment: "0.00",
      travel: "0.00",
      other: "0.00",
    };

    (Object.keys(totals) as CategoryKey[]).forEach((key) => {
      pct[key] = total > 0 ? ((totals[key] / total) * 100).toFixed(2) : "0.00";
    });

    return {
      totalsByType: totals,
      totalAmount: total,
      percentages: pct,
    };
  }, [expenses]);

  /* =====================
     Handlers
  ===================== */

  React.useEffect(() => {
    if (isDBReady) {
      handleGetExpenses();
    } else {
      handleInitDB();
    }
  }, [isDBReady]);

  const handleAddExpense = React.useCallback(async (): Promise<void> => {
    const trimmedName = expenseName.trim();
    const numericAmount = Number(amount);

    if (!trimmedName || !expenseType || numericAmount <= 0) return;

    const currentDate = Date.now();
    const newExpense = {
      id: id ?? currentDate,
      expenseName: trimmedName,
      amount: numericAmount,
      expenseType: expenseType,
    } as Expense

    try {
      if (id !== null) {
        // Implement update logic here if needed
        await updateData(Stores.Expenses, id, newExpense);
        setId(null);
      } else {
        // Adding new expense
        await addData(Stores.Expenses, newExpense);
      }
      handleGetExpenses();
      setExpenseName("");
      setAmount("");
      setExpenseType("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    }
  }, [expenseName, amount, expenseType]);

  const handleRemove = React.useCallback((id: number): void => {
    handleRemoveExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleClearAll = React.useCallback((): void => {
    setExpenses([]);
  }, []);

  /* =====================
     UI helpers
  ===================== */

  const renderBarSegment = (key: CategoryKey): JSX.Element => {
    const cat = CATEGORIES.find((c) => c.key === key)!;
    const width = `${percentages[key]}%`;

    return (
      <Box
        key={key}
        title={`${cat.label}: ${percentages[key]}%`}
        aria-label={`${cat.label} ${percentages[key]} percent`}
        sx={{
          width,
          minHeight: 40,
          bgcolor: cat.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "0.85rem",
        }}
      >
        {Number(percentages[key]) >= 8 ? `${percentages[key]}%` : null}
      </Box>
    );
  };

  const handleRemoveExpense = async (id: number) => {
    try {
      console.log('Deleting expense with id:', id);
      await deleteData(Stores.Expenses, id);
      handleGetExpenses();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong deleting the user');
      }
    }
  };

  const handleEditExpense = async (id: number) => {
    // Implement edit functionality here
    const data: Expense | null = await getData<Expense>(Stores.Expenses, id);
    setExpenseName(data?.expenseName || '');
    setAmount(data?.amount.toString() || '');
    setExpenseType(data?.expenseType || '');
    setId(id);
  }

  const handleGetExpenses = async () => {
    const expenses = await getStoreData<Expense>(Stores.Expenses);
    setExpenses(expenses);
  };

  /* =====================
     Render
  ===================== */

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Card elevation={1}>
        <CardHeader
          title="My Expense Tracker"
          subheader={
            totalAmount > 0
              ? `Total: $${totalAmount.toFixed(2)}`
              : "Add your first expense"
          }
        />
        <Divider />

        {/* Summary Bar */}
        <Box sx={{ px: 2, py: 1 }}>
          <Grid container spacing={2} alignItems="center">
            {/* <Grid item xs={12} md={8}>
              <Box
                role="img"
                aria-label="Expense distribution bar"
                sx={{
                  display: "flex",
                  width: "100%",
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                }}
              >
                {CATEGORIES.map((c) => renderBarSegment(c.key))}
              </Box>
            </Grid> */}

            <Grid item xs={12} md={12}>
              <Stack spacing={1}>
                <Typography variant="h6">Expense Summary</Typography>
                <Card>
                  {CATEGORIES.map((c) => (
                    <Box flex={1} flexDirection="row" key={c.key} display="flex" padding={'2px'} width="100%">
                      {Number(percentages[c.key]) > 0 &&
                        <>
                          <Box bgcolor={c.color} color="#fff" fontWeight={'bold'}>${c.label}</Box>
                          <Box sx={{ width: `${percentages[c.key]}%`, height: 20, bgcolor: c.color, color: '#fff', textAlign: 'center', fontWeight:'bold' }}> 
                            <Typography variant="body2" fontWeight={'bold'}>
                              {totalsByType[c.key] > 0 &&
                              `$${totalsByType[c.key].toFixed(2)}`}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight={'bold'}>
                          {`${percentages[c.key]}%`}
                          </Typography>
                        </>
                        }
                    </Box>
                  ))}
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Form + Table */}
        <Grid container spacing={2} sx={{ px: 2, py: 2 }}>
          {/* Form */}
          <Grid item xs={12} md={4} lg={3}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <TextField
                  label="Expense name"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  fullWidth
                />

                <TextField
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  inputProps={{ step: "0.01", min: "0" }}
                />

                <FormControl fullWidth>
                  <InputLabel id="expense-type-label">Expense Type</InputLabel>
                  <Select
                    labelId="expense-type-label"
                    value={expenseType}
                    label="Expense Type"
                    onChange={(e: SelectChangeEvent) =>
                      setExpenseType(e.target.value as CategoryKey)
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c.key} value={c.key}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={handleAddExpense}
                    disabled={!expenseName.trim() || !expenseType || Number(amount) <= 0}
                  >
                    Add Expense
                  </Button>

                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleClearAll}
                    disabled={!expenses.length}
                  >
                    Clear All
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          {/* Table */}
          <Grid item xs={12} md={8} lg={9}>
            <Card
              variant="outlined"
              sx={{
                p: 2,
                height: { xs: 420, md: 520, lg: 600 },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Expenses
              </Typography>

              <TableContainer component={Paper} sx={{ flex: 1 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: "bold" }}>Date / Time</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>Expense</TableCell>
                      <TableCell align="right" style={{ fontWeight: "bold" }}>Amount</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>Type</TableCell>
                      <TableCell align="center" style={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{moment(expense.id).format('DD/MMM/YYYY hh:mm:ss')}</TableCell>
                        <TableCell>{expense.expenseName}</TableCell>
                        <TableCell align="right">
                          ${expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {expense.expenseType}
                        </TableCell>
                        <TableCell style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                          <EditIcon style={{ cursor: 'pointer' }} onClick={() => handleEditExpense(expense.id)} />
                          <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => handleRemove(expense.id)} />
                        </TableCell>
                      </TableRow>
                    ))}

                    {!expenses.length && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No expenses yet. Add your first one!
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
