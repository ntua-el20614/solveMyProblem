import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { PageName } from '../components/SecondaryHeader';
import Results from '../components/Results';

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
    if (!data) return <div style={{ marginTop: "75px", display: "flex", position: "center" }}>No result found for ID: {id}</div>;

    return (
        <div style={{ textAlign: 'center', marginTop: '75px' }}>
            <PageName name="View Results" />
            {
                console.log(data)
            }
            <div style={{ margin: '-40px 120px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>ID: {data._id}</span>
                    <span>Name: {data.name}</span>
                    <span>Creator: {data.createdBy}</span>
                    <span>Executed on: {data.executedOn}</span>
                </div>
            </div>
            <h3 style={{ textAlign: 'left', margin: '40px 0 5px 10%' }}>Metadata</h3>
            <div style={{ margin: 'auto', width: '85%', flex: 1, height: '20%', maxHeight: '20%', overflowY: 'scroll', border: '4px solid black', backgroundColor: 'gray', padding: '10px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        Parameter 1:
                    </div>
                    <div style={{ width: '50%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        cars available
                    </div>
                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        {data.param1}
                    </div>
                </div>


                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        Parameter 2:
                    </div>
                    <div style={{ width: '50%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        starting point
                    </div>
                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        {data.param2}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        Parameter 3:
                    </div>
                    <div style={{ width: '50%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        maximum distance for each car
                    </div>
                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        {data.param3}
                    </div>
                </div>

            </div>
            <h3 style={{ textAlign: 'left', margin: '50px 0 5px 10%' }}>Results</h3>

            <div style={{ marginTop: '0px', margin: 'auto', width: '85%', flex: 1, height: '50%', maxHeight: '390px', overflowY: 'scroll', border: '4px solid black', backgroundColor: 'gray', padding: '10px' }}>
                <Results data={data} />
            </div>
        </div>

    );
}

export default Viewresults;
