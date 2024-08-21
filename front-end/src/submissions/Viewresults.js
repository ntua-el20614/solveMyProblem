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
        /*
       http://localhost:4002/view/${(username)}
       this endpoint, needs to return the name of the submission and also when it was EXECUTED on, not created on
       also i need the values for the parameters given
        */


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

        /*
        const fetchResults = () => {
            setLoading(true);
            setData(

                {
                    "_id": "66b91b2387838d411fc5b2d2",
                    "output_file": "Objective: 1243477\nRoute for vehicle 0:\n 0 -\u003E  12 -\u003E  7 -\u003E  13 -\u003E  2 -\u003E  4 -\u003E 0\nDistance of the route: 8361m\n\nRoute for vehicle 1:\n 0 -\u003E 0\nDistance of the route: 0m\n\nRoute for vehicle 2:\n 0 -\u003E  8 -\u003E  17 -\u003E  11 -\u003E  3 -\u003E  10 -\u003E  15 -\u003E  19 -\u003E  5 -\u003E 0\nDistance of the route: 12109m\n\nRoute for vehicle 3:\n 0 -\u003E  18 -\u003E  16 -\u003E  14 -\u003E  9 -\u003E  6 -\u003E  1 -\u003E 0\nDistance of the route: 12107m\n\nMaximum of the route distances: 12109m\n",
                    "status": "solved",
                    "createdBy": "chris",
                    "__v": 0
                }

                
                  {
    "_id": "66c496d24da0a09faa6fe64c",
    "output_file": "No solution found !\n",
    "status": "solved",
    "createdBy": "george",
    "__v": 0
  }


  
  {
    "_id": "66c40a014da0a09faa6fe611",
    "output_file": "Command failed: python vrpSolver.py /tmp/input_data.json s a a\nTraceback (most recent call last):\n  File \"/app/vrpSolver.py\", line 133, in \u003Cmodule\u003E\n    main()\n  File \"/app/vrpSolver.py\", line 75, in main\n    num_vehicles = int(sys.argv[2])\nValueError: invalid literal for int() with base 10: 's'\n",
    "status": "solved",
    "createdBy": "george",
    "__v": 0
  }

                /*
    
                {
        "_id": "66b91b2387838d411fc5b2d2",
        "output_file": "Objective: 1243477\nRoute for vehicle 0:\n 0 ->  12 ->  7 ->  13 ->  2 ->  4 -> 0\nDistance of the route: 8361m\n\nRoute for vehicle 1:\n 0 -> 0\nDistance of the route: 0m\n\nRoute for vehicle 2:\n 0 ->  8 ->  17 ->  11 ->  3 ->  10 ->  15 ->  19 ->  5 -> 0\nDistance of the route: 12109m\n\nRoute for vehicle 3:\n 0 ->  18 ->  16 ->  14 ->  9 ->  6 ->  1 -> 0\nDistance of the route: 12107m\n\nMaximum of the route distances: 12109m\n",
        "status": "solved",
        "createdBy": "chris",
        "__v": 0
                }
    
                //

            );
            setLoading(false);

        }
        */

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
            <div style={{ margin: '0px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>ID: {data._id}</span>
                    <span>Name: {data.name}</span>
                    <span>Creator: {data.createdBy}</span>
                    <span>Solver ID:</span>
                </div>
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <p>Executed on: {data.executionDate}</p>
                </div>
            </div>
            <h3 style={{ textAlign: 'left', margin: '-2% 0 5px 10%' }}>Metadata</h3>
            <div style={{ margin: 'auto', width: '85%', flex: 1, height: '20%', maxHeight: '20%', overflowY: 'scroll', border: '4px solid black', backgroundColor: 'gray', padding: '10px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        Parameter 1:
                    </div>
                    <div style={{ width: '50%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        cars available
                    </div>
                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>
                        value
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
                        value
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
                        value
                    </div>
                </div>

            </div>
            <h3 style={{ textAlign: 'left', margin: '10px 0 5px 10%' }}>Results</h3>

            <div style={{ marginTop: '0px', margin: 'auto', width: '85%', flex: 1, height: '45%', maxHeight: '45%', overflowY: 'scroll', border: '4px solid black', backgroundColor: 'gray', padding: '10px' }}>
                <Results data={data} />
            </div>
        </div>

    );
}

export default Viewresults;
