import React from "react";
import {FaArrowUp, FaArrowDown} from 'react-icons/fa'; 

const formatCurrency = (value) => {
    if(value === undefined || value === null) {
        return 'R$ 0,00'
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: "BRL" });
};

const SummaryCard = ({ title, value, type }) => {
    const isIncome = type === 'income';
    const Icon = isIncome ? FaArrowUp : FaArrowDown;
    const color = isIncome 
        ? "text-green-600 dark:text-green-500"
        : "text-red-600 dark:text-red-500";

    return (
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    {title}
                </h3>
                <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <p className={`mt-2 text-3xl font-bold ${color}`}>
                {formatCurrency(value)}
            </p>
        </div>
    );
};

export default SummaryCard;