// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON
app.use(express.json());

app.post('/calculate-sip', (req, res) => {
    const { monthlyInvestment, annualInterestRate, investmentPeriodYears, inflationRate } = req.body;
    
    // Convert annual interest rate to monthly rate
    const monthlyRate = annualInterestRate / 12 / 100;
    const n = investmentPeriodYears * 12;
    
    // Calculate future value of SIP without inflation adjustment
    const futureValue = monthlyInvestment * ((1 + monthlyRate) ** n - 1) / monthlyRate * (1 + monthlyRate);

    // Adjust for inflation
    const inflationAdjustedFutureValue = futureValue / ((1 + (inflationRate / 100)) ** investmentPeriodYears);

    res.json({ 
        futureValue: futureValue.toFixed(2), 
        inflationAdjustedFutureValue: inflationAdjustedFutureValue.toFixed(2) 
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
