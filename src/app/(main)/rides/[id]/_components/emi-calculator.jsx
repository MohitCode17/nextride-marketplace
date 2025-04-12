"use client";

import React, { useCallback, useEffect, useState } from "react";

function EmiCalculator({ price }) {
  const [values, setValues] = useState({
    loanAmount: price,
    downPayment: "",
    interestRate: 5,
    loanTenure: 1,
  });

  const [results, setResults] = useState({
    emi: 0,
    totalInterest: 0,
    totalAmount: 0,
    principalAmount: 0,
  });

  const formatToINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateEMI = useCallback(() => {
    const totalAmount = parseFloat(values.loanAmount) || 0;
    const downPayment = parseFloat(values.downPayment) || 0;
    const p = totalAmount - downPayment; // Principal after down payment
    const r = (parseFloat(values.interestRate) || 0) / 12 / 100;
    const n = parseFloat(values.loanTenure) || 0;

    if (p > 0 && r && n) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayable = emi * n;
      const totalInterest = totalPayable - p;

      setResults({
        emi: emi,
        totalInterest: totalInterest,
        totalAmount: totalPayable + downPayment,
        principalAmount: p,
      });
    } else {
      setResults({
        emi: 0,
        totalInterest: 0,
        totalAmount: 0,
        principalAmount: 0,
      });
    }
  }, [values]);

  useEffect(() => {
    calculateEMI();
  }, [values, calculateEMI]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value === "" || (!isNaN(value) && value >= 0)) {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-teal-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-teal-900 dark:text-white mb-8 font-inter">
          NextRide Loan Calculator
        </h1>

        <div className="grid md:grid-cols-1 gap-8">
          <div className="bg-teal-50 dark:bg-teal-800 rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-teal-900 dark:text-white font-inter mb-2">
                  Bike Price (₹)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="loanAmount"
                    value={values.loanAmount}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-teal-200 dark:border-teal-700 rounded-lg text-teal-900 dark:text-white bg-white dark:bg-teal-800 font-inter"
                    placeholder="Enter bike price"
                  />
                </div>
                <input
                  type="range"
                  name="loanAmount"
                  value={values.loanAmount}
                  onChange={handleSliderChange}
                  min="0"
                  max="1000000"
                  step="1000"
                  className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer dark:bg-teal-700 mt-2"
                />
              </div>

              <div>
                <label className="block text-teal-900 dark:text-white font-inter mb-2">
                  Down Payment (₹)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="downPayment"
                    value={values.downPayment}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-teal-200 dark:border-teal-700 rounded-lg text-teal-900 dark:text-white bg-white dark:bg-teal-800 font-inter"
                    placeholder="Enter down payment"
                  />
                </div>
                <input
                  type="range"
                  name="downPayment"
                  value={values.downPayment}
                  onChange={handleSliderChange}
                  min="0"
                  max={values.loanAmount || 0}
                  step="1000"
                  className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer dark:bg-teal-700 mt-2"
                />
              </div>

              <div>
                <label className="block text-teal-900 dark:text-white font-inter mb-2">
                  Interest Rate (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="interestRate"
                    value={values.interestRate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-teal-200 dark:border-teal-700 rounded-lg text-teal-900 dark:text-white bg-white dark:bg-teal-800 font-inter"
                    placeholder="Enter interest rate"
                  />
                </div>
                <input
                  type="range"
                  name="interestRate"
                  value={values.interestRate}
                  onChange={handleSliderChange}
                  min="0"
                  max="30"
                  step="0.1"
                  className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer dark:bg-teal-700 mt-2"
                />
              </div>

              <div>
                <label className="block text-teal-900 dark:text-white font-inter mb-2">
                  Loan Tenure (months)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="loanTenure"
                    value={values.loanTenure}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-teal-200 dark:border-teal-700 rounded-lg text-teal-900 dark:text-white bg-white dark:bg-teal-800 font-inter"
                    placeholder="Enter loan tenure"
                  />
                </div>
                <input
                  type="range"
                  name="loanTenure"
                  value={values.loanTenure}
                  onChange={handleSliderChange}
                  min="0"
                  max="84"
                  step="1"
                  className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer dark:bg-teal-700 mt-2"
                />
              </div>
            </div>
          </div>

          <div className="bg-teal-50 dark:bg-teal-800 rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-inter text-teal-700 dark:text-teal-300 mb-2">
                  Monthly EMI
                </h2>
                <p className="text-3xl font-bold text-teal-900 dark:text-white font-inter">
                  {formatToINR(results.emi)}
                </p>
              </div>

              <div className="pt-4 border-t border-teal-200 dark:border-teal-700">
                <div className="flex justify-between mb-4">
                  <span className="text-teal-700 dark:text-teal-300 font-inter">
                    Bike Price
                  </span>
                  <span className="text-teal-900 dark:text-white font-bold font-inter">
                    {formatToINR(parseFloat(values.loanAmount) || 0)}
                  </span>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="text-teal-700 dark:text-teal-300 font-inter">
                    Down Payment
                  </span>
                  <span className="text-teal-900 dark:text-white font-bold font-inter">
                    {formatToINR(parseFloat(values.downPayment) || 0)}
                  </span>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="text-teal-700 dark:text-teal-300 font-inter">
                    Loan Amount
                  </span>
                  <span className="text-teal-900 dark:text-white font-bold font-inter">
                    {formatToINR(results.principalAmount)}
                  </span>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="text-teal-700 dark:text-teal-300 font-inter">
                    Total Interest
                  </span>
                  <span className="text-teal-900 dark:text-white font-bold font-inter">
                    {formatToINR(results.totalInterest)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-teal-700 dark:text-teal-300 font-inter">
                    Total Amount
                  </span>
                  <span className="text-teal-900 dark:text-white font-bold font-inter">
                    {formatToINR(results.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500/70 text-sm">
            This is estimated EMI value. Actual EMI may vary based on your
            credit score and lender terms.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmiCalculator;
