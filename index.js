const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

let expenses = [];

app.get('/', (req, res) => {
    res.send('Welcome to Expense Tracker!')
})

//For adding an Expense
app.post("/expenses", (req, res) => {
    const { category, amount, date } = req.body;

    if (!category || !amount || !date) {
        return res.status(400).json({ status: "error", error: "All fields are required" });
    }

    if (amount <= 0) {
        return res.status(400).json({ status: "error", error: "Amount must be positive" });
    }

    const expense = { id: expenses.length + 1, category, amount, date };
    expenses.push(expense);

    res.status(201).json({ status: "success", data: expense });

});

//For getting all the expenses 
app.get("/expenses", (req, res) => {
    res.json({ status: "success", data: expenses });
});

//For analysing the expenses
app.get("/expenses/analysis", (req, res) => {
    if (expenses.length === 0) {
        return res.status(200).json({ status: "success", data: "No expenses found." });
    }

    const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    //Object to store different categories
    const categories = {}

    expenses.forEach((expense) => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
    });

    const highestCategory = Object.keys(categories).reduce((a, b) =>
        categories[a] > categories[b] ? a : b
    );

    res.json({
        status: "success",
        data: {
            totalSpending,
            highestCategory,
            spendingByCategory: categories,
        },
    });
});


app.listen(port, () => {
    console.log(`Express tracker API running on port ${port}`)
})