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
    const { monthlyInvestment, annualInterestRate, investmentPeriodYears, inflationRate, stepUpPercentage } = req.body;
    
    const monthlyRate = annualInterestRate / 12 / 100;
    let futureValue = 0;

    // Calculate future value with yearly step-up
    let currentMonthlyInvestment = monthlyInvestment;
    for (let year = 1; year <= investmentPeriodYears; year++) {
        const monthsInYear = 12;
        const n = monthsInYear * (investmentPeriodYears - year + 1);
        
        // Calculate FV for the current year's monthly investment amount
        futureValue += currentMonthlyInvestment * ((1 + monthlyRate) ** n - 1) / monthlyRate * (1 + monthlyRate);

        // Apply yearly step-up
        currentMonthlyInvestment *= (1 + stepUpPercentage / 100);
    }

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
