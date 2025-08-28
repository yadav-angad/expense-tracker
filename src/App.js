import React from "react";
import "./App.css";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

function App() {
  const foodExpenseColorCode = 'RED';
  const travelExpenseColorCode = 'GREEN';
  const transportExpenseColorCode = 'DARKBLUE';
  const entertainmentExpenseColorCode = 'PURPLE';
  const otherExpenseColorCode = 'BLACK';

  const [expenseType, setExpenseType] = React.useState("");
  const [expenseName, setExpenseName] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [foodPercentage, setFoodPercentage] = React.useState(25);
  const [transportPercentage, setTransportPercentage] = React.useState(25);
  const [entertainmentPercentage, setEntertainmentPercentage] = React.useState(25);
  const [travelPercentage, setTravelPercentage] = React.useState(25);
  const [otherPercentage, setOtherPercentage] = React.useState(25);

  const handleChange = (event) => {
    setExpenseType(event.target.value);
  };

  const [expenses, setExpenses] = React.useState([]);

  const handleAddExpense = () => {
    // Logic to add expense
    if(expenses.length === 0) {
      setFoodPercentage(0);
      setEntertainmentPercentage(0);
      setTransportPercentage(0);
      setTravelPercentage(0);
      setOtherPercentage(0);
    }

    const newExpense = {
      id: expenses.length + 1,
      expenseName: expenseName,
      amount: amount,
      type: expenseType,
    };
    setExpenses([...expenses, newExpense]);
  };

  React.useEffect(() => {
    // Calculate total for each expense type
    let foodExpenses = 0;
    let transportExpenses = 0;
    let entertainmentExpenses = 0;
    let travelExpenses = 0;
    let otherExpenses = 0;
    let totalAmount = 0;
    // Calculate total for each expense type and overall total
    expenses.forEach(exp => {
      totalAmount += Number(exp.amount);
      if (exp.type === "food") foodExpenses += Number(exp.amount);
      if (exp.type === "transport") transportExpenses += Number(exp.amount);
      if (exp.type === "entertainment") entertainmentExpenses += Number(exp.amount);
      if (exp.type === "travel") travelExpenses += Number(exp.amount);
      if (exp.type === "other") otherExpenses += Number(exp.amount);

      // Calculate percentages, avoid NaN by checking totalAmount
    setFoodPercentage(totalAmount > 0 ? ((foodExpenses / totalAmount) * 100).toFixed(2) : 0);
    setTransportPercentage(totalAmount > 0 ? ((transportExpenses / totalAmount) * 100).toFixed(2) : 0);
    setEntertainmentPercentage(totalAmount > 0 ? ((entertainmentExpenses / totalAmount) * 100).toFixed(2) : 0);
    setTravelPercentage(totalAmount > 0 ? ((travelExpenses / totalAmount) * 100).toFixed(2) : 0);
    setOtherPercentage(totalAmount > 0 ? ((otherExpenses / totalAmount) * 100).toFixed(2) : 0);
    });

    console.log(foodPercentage, transportPercentage, entertainmentPercentage, travelPercentage, otherPercentage);
  }, [expenses]);

  return (
    <Box
      sx={{
        m: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        gap: 1,
      }}
    >
      <CardHeader title="My Expense Tracker" />
      <Grid sx={{ maxWidth: "100%", display: "flex" }} xs={12} sm={6} md={6} lg={6}>
        <div
          style={{
            width: `${foodPercentage}%`,
            minHeight: 40,
            backgroundColor: foodExpenseColorCode,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        <div
          style={{
            width: `${transportPercentage}%`,
            minHeight: 40,
            backgroundColor: transportExpenseColorCode,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        <div
          style={{
            width: `${entertainmentPercentage}%`,
            minHeight: 40,
            backgroundColor: entertainmentExpenseColorCode,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        <div
          style={{
            width: `${travelPercentage}%`,
            minHeight: 40,
            backgroundColor: travelExpenseColorCode,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        <div
          style={{
            width: `${otherPercentage}%`,
            minHeight: 40,
            backgroundColor: otherExpenseColorCode,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </Grid>
      <Grid sx={{display: "flex", flexDirection: "row", width: "100%"}} xs={12}
          sm={6}
          md={6}
          lg={6}>
        <Grid
          sx={{
            p: 2,
            m: 2,
            py: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
          }}
          
        >
          <TextField label="Enter expense" type="string" variant="outlined" name="expenseName" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} />
          <TextField label="Enter Amount" type="number" variant="outlined" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">Expense Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={expenseType}
              label="Expense Type"
              onChange={handleChange}
            >
              <MenuItem value="food">Food</MenuItem>
              <MenuItem value="transport">Transport</MenuItem>
              <MenuItem value="entertainment">Entertainment</MenuItem>
              <MenuItem value="travel">Travel</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={handleAddExpense}>
              {`Add Expense`}
            </Button>
            <Grid mt={2} display={'flex'} flexDirection={'column'} gap={1}>
              <Typography variant="h5">Expense Summary</Typography>
              <Grid display={"flex"} flexDirection={'row'} alignItems={'center'} gap={1}><div style={{width: '30px', minHeight: '30px', backgroundColor: foodExpenseColorCode}}/><Typography>{`Food: ${foodPercentage}%`}</Typography></Grid>
              <Grid display={"flex"} flexDirection={'row'} alignItems={'center'} gap={1}><div style={{width: '30px', minHeight: '30px', backgroundColor: transportExpenseColorCode}}/><Typography>{`Transport: ${transportPercentage}%`}</Typography></Grid>
              <Grid display={"flex"} flexDirection={'row'} alignItems={'center'} gap={1}><div style={{width: '30px', minHeight: '30px', backgroundColor: entertainmentExpenseColorCode}}/><Typography>{`Entertainment: ${entertainmentPercentage}%`}</Typography></Grid>
              <Grid display={"flex"} flexDirection={'row'} alignItems={'center'} gap={1}><div style={{width: '30px', minHeight: '30px', backgroundColor: travelExpenseColorCode}}/><Typography>{`Travel: ${travelPercentage}%`}</Typography></Grid>
              <Grid display={"flex"} flexDirection={'row'} alignItems={'center'} gap={1}><div style={{width: '30px', minHeight: '30px', backgroundColor: otherExpenseColorCode}}/><Typography>{`Other: ${otherPercentage}%`}</Typography></Grid>
            </Grid>
          </FormControl>
        </Grid>
        <Card sx={{
            p: 2,
            m: 2,
            py: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 600,
            height: 'calc(100vh - 200px)',
          }}>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sr. #</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Expense</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense, idx) => (
                  <TableRow
                    key={expense.id}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? "white" : "#f5f5f5"
                    }}
                  >
                    <TableCell>{expense.id}</TableCell>
                    <TableCell>{expense.expenseName}</TableCell>
                    <TableCell>${expense.amount}</TableCell>
                    <TableCell>{expense.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Box>
  );
}

export default App;
