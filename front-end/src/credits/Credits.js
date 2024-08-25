import React, { useState, useEffect } from "react";
import { PageName } from '../components/SecondaryHeader';
import Cookies from 'js-cookie';
import { StyledButton } from "../components/Button";

function Credits() {
    const [credits, setCredits] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amountToChange, setAmountToChange] = useState(0);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    useEffect(() => {
        fetchCredits();
    }, []);

    const fetchCredits = async () => {
        const username = Cookies.get('user_SMP');
        try {
            const creditsResponse = await fetch(`http://localhost:4001/view_credits/${username}`);
            if (creditsResponse.ok) {
                const creditsData = await creditsResponse.json();
                setCredits(creditsData.credits);
            }
        } catch (error) {
            console.error('Error fetching credits:', error);
        }
    };

    const handleAddCredits = (amount) => {
        setIsModalOpen(true);
        setAmountToChange(amount);
    };

    const handleConfirmAddCredits = async () => {
        const username = Cookies.get('user_SMP');
        try{
            const response = await fetch(`http://localhost:4001/change_temp_credits/${username}/${amountToChange}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ credits: amountToChange })
            });
            if(response.ok){
                console.log('Temporary credits updated successfully:', amountToChange);
            }
        }catch(error){
            console.error('Error fetching credits:', error);
        }
        try {
            const response = await fetch(`http://localhost:4001/change_credits/${username}/${amountToChange}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ credits: amountToChange })
            });
            if (response.ok) {
                console.log('Credits updated successfully:', amountToChange);
                fetchCredits(); // Refresh the credits display
                if (amountToChange === 1)
                    setConfirmationMessage(`${amountToChange} credit has been added to your balance.`);
                else
                    setConfirmationMessage(`${amountToChange} credits have been added to your balance.`);
            } else {
                console.error('Failed to update credits', await response.text());
            }
        } catch (error) {
            console.error('Error updating credits:', error);
        }
        setIsModalOpen(false); // Close modal after operation
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (confirmationMessage) {
                setConfirmationMessage('');
            }
        }, 6000);
        return () => clearInterval(timer);
    }, [confirmationMessage]);

    return (
        <div style={{ textAlign: 'center', marginTop: '75px' }}>
            <PageName name="My Credits" />
            <div style={styles.creditsBox}>
                <h2 style={styles.creditHeader}>My Credits: {credits}</h2>
                <div style={styles.creditInfo}>1 Credit = $1.00</div>
                <div style={styles.creditInfo}>5+1 Credits = $5.00</div>
                <div style={styles.creditInfo}>10+2 Credits = $10.00</div>
                <div style={styles.buttonRow}>
                    <StyledButton onClick={() => handleAddCredits(1)}>+1 Credit</StyledButton>
                    <StyledButton onClick={() => handleAddCredits(6)}>+6 Credits (5+1 Free)</StyledButton>
                    <StyledButton onClick={() => handleAddCredits(12)}>+12 Credits (10+2 Free)</StyledButton>
                </div>
                {isModalOpen && (
                    <Modal
                        amount={amountToChange}
                        onConfirm={handleConfirmAddCredits}
                        onCancel={handleCancel}
                    />
                )}

            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 10%' }}>
                <StyledButton to='/homepage'>Return</StyledButton>
            </div>
            {confirmationMessage &&
                <div style={{ margin: '20px auto', padding: '20px', width: '50%', border: '4px solid black', borderRadius: '15px', fontWeight: 'bold', fontSize: '30px', color: '#1aa90f', backgroundColor: '#bcbcbc', display: confirmationMessage ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center' }}>
                    {confirmationMessage}
                </div>
            }
            
        </div>
    );
}

const styles = {
    creditsBox: {
        margin: 'auto',
        width: '80%',
        height: '50%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid black',
        borderRadius: '15px',
        padding: '20px',
        boxSizing: 'border-box',
        position: 'relative',
        backgroundColor: 'white'
    },
    creditHeader: {
        fontSize: '50px'
    },
    creditInfo: {
        fontSize: '30px',
        marginTop: '10px'
    },
    buttonRow: {
        margin: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '10px'
    },
    confirmationMessage: {
        marginTop: '20px',
        fontSize: '20px',
        color: 'green'
    }
};

function Modal({ amount, onConfirm, onCancel }) {
    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '5px',
            borderRadius: '15px',
            zIndex: 1000
        }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px' }}>
                <h2>Are you sure you want to pay ${amount}?</h2>
                <div style={styles.buttonRow}>

                    <StyledButton onClick={onConfirm}>Pay</StyledButton>
                    <StyledButton onClick={onCancel}>Cancel</StyledButton>
                </div>
            </div>
        </div>
    );
}

export default Credits;
