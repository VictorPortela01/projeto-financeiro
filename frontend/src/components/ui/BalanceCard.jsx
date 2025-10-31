import React from 'react';

// Função de utilidade para formatar moeda (Vamos criar o arquivo) /utils/
const formatCurrency = (value) => {
    if(value === undefined || value === null) {
        return 'R$ 0,00';
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const BalanceCard = ({ balance }) => {
    const isNegative = balance < 0;

    return (
        <div className='rounded-lg bg-white p-6 shadow:md dark:bg-gray-800'>
            <h3 className='text-lg font-medium text-gray-500 dark:text-gray-400'>
                Saldo Total
            </h3>
            <p className={`mt-2 text-4xl font-bold 
                ${isNegative} ? "text-red-600 dark:text-red-500" : "text-green-600 dark:text-green-500"`}>
                {formatCurrency(balance)}
            </p>
        </div>
    )
}

export default BalanceCard;