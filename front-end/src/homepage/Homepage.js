import React, { useEffect, useState, useCallback } from 'react';
import { PageName } from '../components/SecondaryHeader';
import { StyledButton } from '../components/Button';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


function Homepage() {
    const navigate = useNavigate();
    const [credits, setCredits] = useState(0);
    const [tempCredits, setTempCredits] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        //const formattedTime = date.toLocaleTimeString('en-US', { timeStyle: 'short' }); // Gets time in HH:MM AM/PM format
        const formattedDate = date.toLocaleDateString('en-US'); // Gets date in MM/DD/YYYY format
        return `${formattedDate}`;
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
            case "in-queue":
                return "In Queue";
            default:
                return "Unknown Status";
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchCredits = async () => {

        const username = Cookies.get('user_SMP');
        try {
            const creditsResponse = await fetch(`http://localhost:4001/view_credits/${username}`);
            if (creditsResponse.ok) {
                const creditsData = await creditsResponse.json();
                setCredits(creditsData.credits);
            } else {
                console.error('Failed to fetch credits', await creditsResponse.text());
            }

            const tempCreditsResponse = await fetch(`http://localhost:4001/view_temp_credits/${username}`);
            if (tempCreditsResponse.ok) {
                const tempCreditsData = await tempCreditsResponse.json();
                setTempCredits(tempCreditsData.tempCredits);
            } else {
                console.error('Failed to fetch temporary credits', await tempCreditsResponse.text());
            }
        } catch (error) {
            console.error('Error fetching credits:', error);
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

    useEffect(() => {

        const interval = setInterval(fetchCredits, 1000); // Calls fetchSubmissions every second
        return () => clearInterval(interval);

    }, [fetchCredits]);

    const handleRun = async (id) => {
        if (tempCredits > 0) {

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
                    try {
                        const username = Cookies.get('user_SMP');
                        const response2 = await fetch(`http://localhost:4001/change_temp_credits/${username}/-1`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ username: Cookies.get('user_SMP'), value: -1 })
                        });
                        if (response2.ok) {
                            console.log('Temporary Credits updated successfully -1');
                        }
                        else {
                            console.error('Failed to update temporary credits', await response2.text());
                        }
                    }
                    catch (error) {
                        console.error('Error updating temporary credits:', error);
                    }
                }
                else {
                    console.error('Failed to start submission', await response.text());
                }
            } catch (error) {
                console.error('Error sending submission:', error);
            }
        } else {
            alert("Please add credits")
        }
    };

    const handleDelete = async (id, status) => {
        try {
            const response = await fetch(`http://localhost:4000/delete?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                console.log('Submission deleted successfully');
                console.log(status);
                if (status === 'In Queue') {
                    try {
                        const username = Cookies.get('user_SMP');
                        const response2 = await fetch(`http://localhost:4001/change_temp_credits/${username}/1`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ username: Cookies.get('user_SMP'), value: -1 })
                        });
                        if (response2.ok) {
                            console.log('Temporary Credits updated successfully +1');
                        }
                        else {
                            console.error('Failed to update temporary credits', await response2.text());
                        }
                    }
                    catch (error) {
                        console.error('Error updating temporary credits:', error);
                    }
                }
            } else {
                console.error('Failed to delete submission', await response.text());
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
        }
    }
    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '75px' }}>
                <PageName name="Home Page" />
                <div style={{ marginTop: '-35px', textAlign: 'left', paddingLeft: '20px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Your Credits:</div>
                    <div style={{ marginBottom: '10px' }}>
                        <span style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '5px' }}>Available Credits: -</span>
                        <span style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '5px', marginLeft: '10px' }}>Temporary Credits: -</span>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
                    <h1 style={{ margin: 0 }}>My submissions</h1>
                    <StyledButton to={"/my_credits"}>Buy Credits</StyledButton>
                </div>
                <div style={{ maxHeight: '450px', overflowY: 'auto', padding: '5px', border: '2px solid #0cd', borderRadius: '5px', margin: '10px' }}>
                    {isLoading && (
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
            <div style={{ marginTop: '-35px', textAlign: 'left', paddingLeft: '20px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Your Credits:</div>
                <div style={{ marginBottom: '10px' }}>
                    <span style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '5px' }}>Available Credits: {credits}</span>
                    <span style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '5px', marginLeft: '10px' }}>Temporary Credits: {tempCredits}</span>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
                <h1 style={{ margin: 0 }}>My submissions</h1>
                <StyledButton to={"/my_credits"}>Buy Credits</StyledButton>
            </div>
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
                            {
                                //console.log(submission.status, submission.status !== 'Ready' &&  (submission.status !== 'In Queue'))
                            }
                            <button
                                style={{
                                    ...buttonStyle,
                                    color: !(submission.status !== 'Ready' && (submission.status !== 'In Queue')) ? 'black' : 'gray',
                                    cursor: !(submission.status !== 'Ready' && (submission.status !== 'In Queue')) ? 'pointer' : 'not-allowed'
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onClick={() => {
                                    console.log("view/edit", submission._id); navigate(`/edit_submission/${submission._id}`)
                                }}
                                disabled={submission.status !== 'Ready' && (submission.status !== 'In Queue')}
                            >
                                {
                                    (submission.status === 'In Queue') ? 'View' : 'Edit'
                                }
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
                                onClick={() => handleDelete(submission._id, submission.status)}
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
