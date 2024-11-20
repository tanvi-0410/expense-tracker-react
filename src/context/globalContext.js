import React, { useContext, useState } from "react"
import axios from 'axios'


const BASE_URL = "https://expense-tracker-thtr.onrender.com/api/v1/";


const GlobalContext = React.createContext()

export const GlobalProvider = ({ children }) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${BASE_URL}add-income`, income);
            console.log('Income added:', response.data);
        } catch (err) {
            if (err.response) {
                console.error('Error Response:', err.response.data);
                setError(err.response.data);
            } else if (err.request) {
                console.error('Error Request:', err.request);
                setError('No response from server');
            } else {
                console.error('Error Message:', err.message);
                setError(err.message);
            }
        }
    };

    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            setIncomes(response.data);
        } catch (err) {
            console.error('Error fetching incomes:', err.response ? err.response.data : err.message);
            setError(err.response ? err.response.data : err.message);
        }
    };

    const deleteIncome = async (id) => {
        await axios.delete(`${BASE_URL}delete-income/${id}`)
        console.log(`Income with id: ${id} deleted.`)
        getIncomes()
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })
        return totalIncome;
    }

    console.log(totalIncome())

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            totalIncome
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}