import React, { useEffect, useState, useCallback } from 'react';
import { PageName } from '../components/SecondaryHeader';
import { StyledButton } from '../components/Button';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


function Homepage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        //const formattedTime = date.toLocaleTimeString('en-US', { timeStyle: 'short' }); // Gets time in HH:MM AM/PM format
        const formattedDate = date.toLocaleDateString('en-US'); // Gets date in MM/DD/YYYY format
        return `${formattedDate}`;//${formattedTime} 
    };

    const buttonStyle = {
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

    const getStatusDisplay = (status) => {
        switch (status) {
            case "submitted":
                return "Ready";
            case "in-progress":
                return "Running";
            case "solved":
                return "Executed";
            default:
                return "Unknown Status";
        }
    };

    const fetchSubmissions = useCallback(async () => {
        const username = Cookies.get('user_SMP');
        try {
            const response = await fetch(`http://localhost:4000/view?username=${username}`);
            const data = await response.json();
            setSubmissions(data.map(sub => ({
                ...sub,
                status: getStatusDisplay(sub.status)
            })));
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(fetchSubmissions, 1000); // Calls fetchSubmissions every second
        return () => clearInterval(interval);
    }, [fetchSubmissions]);

    const handleRun = async (id) => {
        const postData = {
            id: id
        };
        try {
            const response = await fetch('http://localhost:4000/finalSubmition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
            if (response.ok) {
                console.log('Submission started successfully');
            } else {
                console.error('Failed to start submission', await response.text());
            }
        } catch (error) {
            console.error('Error sending submission:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/delete?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                console.log('Submission deleted successfully');
            } else {
                console.error('Failed to delete submission', await response.text());
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
        }
    }
    if(isLoading){
        return (
            <div style={{ textAlign: 'center', marginTop: '75px' }}>
                <PageName name="Home Page" />
                <div style={{ maxHeight: '450px', overflowY: 'auto', padding: '5px', border: '2px solid #0cd', borderRadius: '5px', margin: '10px' }}>
                    { isLoading && (
                        <div style={{
                            borderRadius: "20px",
                            padding: "10px",
                            backgroundColor: "#f9f9f9",
                            height: "430px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"  // This will center the text vertically
                        }}>
                            Loading submissions ...
                        </div>
                    )}
                </div>
                <div style={{ textAlign: 'left', paddingLeft: '20px', paddingTop: '20px' }}>
                    <StyledButton to={"/new_submission"}>New Problem</StyledButton>
                </div>
            </div>
            )
    }
    return (
        <div style={{ textAlign: 'center', marginTop: '75px' }}>
            <PageName name="Home Page" />
            <div style={{ maxHeight: '450px', overflowY: 'auto', padding: '5px', border: '2px solid #0cd', borderRadius: '5px', margin: '10px' }}>
                {submissions.length > 0 ? submissions.map(submission => (
                    <div key={submission._id} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px' }}>
                        <div style={{ flexGrow: 1, display: 'flex', gap: '10px' }}>
                            <span style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '5px', width: '40%' }}>{submission.name || "No Name Given"}</span>
                            <span style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '5px', width: '20%' }}>
                                {submission.createdOn ? formatDate(submission.createdOn) : "No Date"}
                            </span>
                            <span style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '5px', width: '15%' }}>{submission.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                style={{
                                    ...buttonStyle,
                                    color: submission.status === 'Ready' ? 'black' : 'gray',
                                    cursor: submission.status === 'Ready' ? 'pointer' : 'not-allowed'
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onClick={() => {
                                    console.log("view/edit", submission._id); navigate(`/edit_submission/${submission._id}`)
                                }}
                                disabled={submission.status !== 'Ready'}
                            >
                                View/Edit
                            </button>

                            <button style={{ ...buttonStyle, color: submission.status === 'Ready' ? 'black' : 'gray', cursor: submission.status === 'Ready' ? 'pointer' : 'not-allowed' }} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onClick={() => {
                                if (submission.status === 'Ready')
                                    handleRun(submission._id)
                                else
                                    console.log("Submission is not ready to run")

                            }} disabled={submission.status !== 'Ready'}>Run</button>
                            <button style={{ ...buttonStyle, color: submission.status === 'Executed' ? 'black' : 'gray', cursor: submission.status === 'Executed' ? 'pointer' : 'not-allowed' }} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onClick={() => {
                                if (submission.status === 'Executed') {
                                    navigate(`/view_results/${submission._id}`);
                                }
                            }} disabled={submission.status !== 'Executed'}>View Results</button>
                            <button
                                style={{
                                    ...buttonStyle,
                                    color: submission.status === 'Running' ? 'gray' : 'black',  // Changes color to gray when status is 'Running'
                                    cursor: submission.status === 'Running' ? 'not-allowed' : 'pointer'  // Changes cursor to 'not-allowed' when status is 'Running'
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onClick={() => handleDelete(submission._id)}
                                disabled={submission.status === 'Running'}  // Disables button when status is 'Running'
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                )) : (
                    <div style={{
                        borderRadius: "20px",
                        padding: "10px",
                        backgroundColor: "#f9f9f9",
                        height: "430px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"  // This will center the text vertically
                    }}>
                        No submissions found
                    </div>
                )}
            </div>
            <div style={{ textAlign: 'left', paddingLeft: '20px', paddingTop: '20px' }}>
                <StyledButton to={"/new_submission"}>New Problem</StyledButton>
            </div>
        </div>
    );
}

export default Homepage;
