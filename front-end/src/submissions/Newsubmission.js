import React, { useState, useRef } from 'react';
import { PageName } from '../components/SecondaryHeader';
import Cookies from 'js-cookie';
import { StyledButton } from '../components/Button';

function NewSubmission() {
    const [file, setFile] = useState(null);
    const [param1, setParam1] = useState('');
    const [param2, setParam2] = useState('');
    const [param3, setParam3] = useState('');
    const [message, setMessage] = useState('');
    const [messageStyle, setMessageStyle] = useState({});

    const [submissionName, setSubmissionName] = useState('');
    const fileInputRef = useRef(null);
    const submissionNameRef = useRef(null);

    // Extract username from cookies
    const username = Cookies.get('user_SMP');

    const buttonStyle = {
        margin: '10px',
        backgroundColor: '#E0E0E0',
        border: 'none',
        padding: '8px 16px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: '5px',
        fontWeight: 'bold',
        boxShadow: '0 2px #666',
        marginBottom: '5px',
        color: 'black',
        textShadow: '0px -1px 0px rgba(255, 255, 255, 0.4)',
        transition: 'all 0.1s ease-in-out'
    };


    const handleMouseDown = (e) => {
        e.currentTarget.style.transform = 'translateY(2px)';
        e.currentTarget.style.boxShadow = '0 1px #666';
    };

    const handleMouseUp = (e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '0 2px #666';
    };


    const handleTextChange = (event) => {
        setSubmissionName(event.target.value);
        const textareaLineHeight = 24; // Approx line height in px
        const previousRows = event.target.rows;
        event.target.rows = 1; // Reset rows to recalculate
        const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }

        if (currentRows >= previousRows) {
            event.target.rows = currentRows;
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        handleFileSelection(file);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        handleFileSelection(file);
    };

    const handleFileSelection = (file) => {
        if (file && file.type === "application/json") {
            setFile(file);
            setMessage('');
        } else {
            displayMessage("Please select a JSON file.", '#620000');
            setFile(null);
        }
    };

    const handleAreaClick = () => {
        fileInputRef.current.click(); // Triggers the file input
    };

    const handleSubmit = (event) => {
        //let string = "";
        event.preventDefault();
        if (!file) {
            displayMessage("Please select a JSON file.", '#620000');
            return;
        }
        if (!param2 || param2 === '') {
            setParam2('0');
        }
        if (!param1 || !param3 || param1 === '' || param3 === '') {
            displayMessage("Please fill in all parameters.", '#620000');
            return;
        }
        if (!submissionName) {
            setSubmissionName('');

        }
        console.log(param2)
        //string += param1 + " - " + param2 + " - " + param3 + " - " + submissionName;
        const formData = new FormData();
        formData.append('input_file', file);
        formData.append('param1', param1);
        formData.append('param2', param2);
        formData.append('param3', param3);
        formData.append('username', username);
        formData.append('name', submissionName);

        fetch('http://localhost:4000/submit', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    // Check if the error object exists and display appropriate error messages
                    console.error('Error:', data.error);
                    if (data.error._message) {
                        displayMessage(data.error._message, '#620000', "! try again!"); // Display server validation message
                    } else {
                        displayMessage('Error submitting form.', '#620000'); // Generic error message
                    }
                } else {
                    console.log('Success:', data);
                    displayMessage('Submission successful!', '#90EE90'); // Display success message
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                displayMessage('An error occurred while submitting the form.', '#620000'); // Display network or unexpected error
            });
    };


    const handleClear = () => {
        setFile(null);
        setParam1('');
        setParam2('');
        setParam3('');
        setSubmissionName('');
    };

    const displayMessage = (text, color, message = "") => {
        setMessage(text + "\n" + message);
        setMessageStyle({
            color: color,
            fontWeight: 'bold'
        });
        setTimeout(() => {
            setMessage(''); // Clear message after 3 seconds
        }, 10000);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '75px' }}>
            <PageName name="New Submission" />
            <h2 style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', margin: '20px' }}>Input Data</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', margin: '20px' }}>
                <div style={{ width: '20%', flex: 1, height: '230px', overflowY: 'scroll', border: '4px solid black', backgroundColor: 'gray', padding: '10px' }}>
                    <div style={{ marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        Available vehicles:
                        <input type="text" value={param1} onChange={(e) => setParam1(e.target.value)} style={{ width: '90%', padding: '5px', margin: '5px 0' }} />
                    </div>
                    <div style={{ marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        Starting index location:
                        <input type="text" value={param2} onChange={(e) => setParam2(e.target.value)} style={{ width: '90%', padding: '5px', margin: '5px 0' }} />
                    </div>
                    <div style={{ backgroundColor: 'lightgray', padding: '5px' }}>
                        Maximum distance for each vehicle:
                        <input type="text" value={param3} onChange={(e) => setParam3(e.target.value)} style={{ width: '90%', padding: '5px', margin: '5px 0' }} />
                    </div>
                </div>

                <div style={{ width: '20%', flex: 1, height: '230px', overflowY: 'scroll', border: '4px solid black', backgroundColor: 'gray', padding: '10px' }}>
                    <div style={{ backgroundColor: 'lightgray', padding: '5px', marginBottom: '10px' }}>
                        Submission Name:
                        <textarea
                            value={submissionName}
                            onChange={handleTextChange}
                            ref={submissionNameRef}
                            style={{ width: '90%', padding: '5px', margin: '5px 0', height: 'auto', overflow: 'hidden', resize: 'none' }}
                        />
                    </div>
                </div>
            </div>
            <div style={{ margin: '20px auto', padding: '20px', width: '94%', border: '4px solid black', backgroundColor: 'gray', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <div onClick={handleAreaClick} onDragOver={handleDragOver} onDrop={handleDrop} style={{ width: '50%', height: '100px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {file ? file.name : "Drag and drop a JSON file here or click to select a file"}
                    <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>
                <div style={{ width: '80%', display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
                    <button onClick={handleSubmit} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={buttonStyle}>Create</button>
                    <button onClick={handleClear} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={buttonStyle}>Cancel</button>
                </div>
            </div>

            <div style={{ margin: '20px auto', padding: '20px', width: '94%', border: '4px solid black', backgroundColor: 'gray', display: message ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', color: messageStyle.color, fontWeight: messageStyle.fontWeight }}>
                {message}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 10%' }}>
                <StyledButton to='/homepage'>Return</StyledButton>
            </div>
        </div>
    );
}

export default NewSubmission;
