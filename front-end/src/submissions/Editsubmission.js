import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { PageName } from '../components/SecondaryHeader';
import { StyledButton } from '../components/Button';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function EditSubmission() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inputs, setInputs] = useState({
        param1: '',
        param2: '',
        param3: '',
        name: ''
    });

    const handleChange = (key, value) => {
        setInputs(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleCancel = () => {
        setInputs({
            param1: data.param1,
            param2: data.param2,
            param3: data.param3,
            name: data.name
        });
    };

    const handleDone = async () => {
        const url = `http://localhost:4000/edit`;
        const username = Cookies.get('user_SMP'); 
        const formData = new FormData();
        formData.append('id', id);
        formData.append('param1', inputs.param1);
        formData.append('param2', inputs.param2);
        formData.append('param3', inputs.param3);
        formData.append('name', inputs.name);
        formData.append('username', username); 

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Server Response:", result);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    function formatDate(isoDateString) {
        const optionsDate = { day: '2-digit', month: '2-digit' };
        const optionsTime = { hour: '2-digit', minute: '2-digit' };
        const date = new Date(isoDateString);
        const formattedDate = new Intl.DateTimeFormat('default', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('default', optionsTime).format(date);
        return `${formattedDate} ${formattedTime}`;
    }

    const locations = data && data.input_file ? JSON.parse(data.input_file).Locations : [];

    const MapComponent = () => (
        <MapContainer center={[37.975, 23.734]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.map((loc, index) => (
                <Marker key={index} position={[loc.Latitude, loc.Longitude]}>
                    <Popup>
                        Latitude: {loc.Latitude}, Longitude: {loc.Longitude}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );

    const fetchResults = async () => {
        setLoading(true);
        const username = Cookies.get('user_SMP');
        const url = `http://localhost:4000/view?username=${username}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const results = await response.json();
            const result = results.find(result => result._id === id);
            if (result) {
                setData(result);
                setInputs({
                    param1: result.param1,
                    param2: result.param2,
                    param3: result.param3,
                    name: result.name
                });
            } else {
                console.error('No result found for ID:', id);
            }
        } catch (error) {
            console.error('Fetching error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div style={{ marginTop: "75px", display: "flex", position: "center" }}>No result found for ID: {id}</div>;

    return (
        <div style={{ textAlign: 'center', marginTop: '75px' }}>
            <PageName name="Edit Submission" />
            <div style={{ margin: '-40px 120px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>ID: {data._id}</span>
                    <span>Name: {data.name}</span>
                    <span>Creator: {data.createdBy}</span>
                    <span>Created on: {formatDate(data.createdOn)}</span>
                    <span>Status: {data.status}</span>
                </div>
            </div>
            <h3 style={{ textAlign: 'left', margin: '40px 0 5px 10%' }}>Metadata</h3>
            <div style={{ margin: 'auto', width: '85%', flex: 1, height: '20%', maxHeight: '20%', overflowY: 'scroll', border: '4px solid black', backgroundColor: 'gray', padding: '10px' }}>
                {/* Parameters and Metadata Inputs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Parameter 1:</div>
                    <div style={{ width: '50%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Cars available</div>
                    <input value={inputs.param1} onChange={(e) => handleChange('param1', e.target.value)} style={{ width: '20%', marginBottom: '10px', backgroundColor: 'white', padding: '5px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Parameter 2:</div>
                    <div style={{ width: '50%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Starting point</div>
                    <input value={inputs.param2} onChange={(e) => handleChange('param2', e.target.value)} style={{ width: '20%', marginBottom: '10px', backgroundColor: 'white', padding: '5px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Parameter 3:</div>
                    <div style={{ width: '50%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Maximum distance for each car</div>
                    <input value={inputs.param3} onChange={(e) => handleChange('param3', e.target.value)} style={{ width: '20%', marginBottom: '10px', backgroundColor: 'white', padding: '5px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Name:</div>
                    <div style={{ width: '50%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Submission's name</div>
                    <input value={inputs.name} onChange={(e) => handleChange('name', e.target.value)} style={{ width: '20%', marginBottom: '10px', backgroundColor: 'white', padding: '5px', textAlign: 'center' }} />
                </div>
            </div>
            <h3 style={{ textAlign: 'left', margin: '10px 0 5px 10%' }}>Input data</h3>
            <div style={{
                display: 'flex',
                marginTop: '0px',
                margin: 'auto',
                width: '85%',
                height: '40%',
                maxHeight: '350px',
                border: '4px solid black',
                backgroundColor: 'gray',
                padding: '10px'
            }}>
                {/* Columns Setup */}
                {/* Left Column for JSON data */}
                <div style={{
                    flex: 1,
                    overflowY: 'scroll',
                    padding: '10px',
                    color: 'white'
                }}>
                    {data && data.input_file ? (
                        <pre style={{ textAlign: 'left' }}>{JSON.stringify(JSON.parse(data.input_file), null, 2)}</pre>
                    ) : (
                        <p>No input data available.</p>
                    )}
                </div>

                {/* Middle Column for File Drag and Drop */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeft: '2px solid white',
                    borderRight: '2px solid white'
                }}>
                    <div style={{
                        width: '80%',
                        height: '80%',
                        backgroundColor: 'lightgray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        Drag and drop a file here
                    </div>
                </div>

                {/* Right Column for Map */}
                <div style={{
                    flex: 1,
                    overflowY: 'scroll'
                }}>
                    <MapComponent />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 10%' }}>
                <div>
                    <StyledButton to="/homepage">Return</StyledButton
>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginRight: '10px' }}>
                    <StyledButton onClick={handleCancel} style={{ padding: '10px' }}>Cancel</StyledButton>
                    <StyledButton onClick={handleDone} style={{ padding: '10px' }}>Done</StyledButton>
                </div>
            </div>
        </div>
    )

}
export default EditSubmission;