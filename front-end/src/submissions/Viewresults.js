import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { PageName } from '../components/SecondaryHeader';

function Viewresults() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            const username = Cookies.get('user_SMP');
            const url = `http://localhost:4002/view/${(username)}`; // Use username in the URL
            console.log('Fetching results from:', url);
            try {
                const response = await fetch(url, {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            
                const results = await response.json();
                console.log('Results:', results);
                // Find the result with the matching ID
                const result = results.find(result => result._id === id);
                console.log('Result:', result);
                setData(result);
            } catch (error) {
                console.error('Fetching error:', error);
            }
            setLoading(false);
        };

        fetchResults();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div style={{ marginTop:"75px",display: "flex", position:"center" }}>No result found for ID: {id}</div>;

    return (
        <div style={{ textAlign: 'center', marginTop: '75px' }}>
            <PageName name="View Results" />
            <h2>ID: {data._id}</h2>
            <p>Status: {data.status}</p>
            <p>Created by: {data.createdBy}</p>
        </div>
    );
}

export default Viewresults;
