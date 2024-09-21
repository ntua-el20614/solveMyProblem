import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { PageName } from '../components/SecondaryHeader';
import { StyledButton } from '../components/Button';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function EditSubmission() {
    const { id } = useParams();
    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [view, setViewMode] = useState(false);


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
        setSelectedFile(null);
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

        if (selectedFile) {
            formData.append('input_file', selectedFile); // Append the file with the field name 'input_file'
        }
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

            setModalMessage('Problem updated successfully');
            setModalVisible(true);
            await fetchResults();

        } catch (error) {
            console.error('Error submitting data:', error);
            setModalMessage('Error submitting data. Please try again.');
            setModalVisible(true);
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

    const calculateCenter = (locations) => {
        if (locations.length === 0) return [37.975, 23.734]; // Default center

        const latitudes = locations.map(loc => loc.Latitude);
        const longitudes = locations.map(loc => loc.Longitude);

        const avgLatitude = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const avgLongitude = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

        return [avgLatitude, avgLongitude];
    };

    const MapComponent = () => {
        const center = calculateCenter(locations);

        return (
            <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {locations.map((loc, index) => (
                    <CircleMarker
                        key={index}
                        center={[loc.Latitude, loc.Longitude]}
                        radius={5}
                        fillColor="red"
                        color="red"
                        weight={1}
                        fillOpacity={0.8}
                    >
                        <Popup>
                            Latitude: {loc.Latitude}, Longitude: {loc.Longitude}
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        );
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
    };


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
                console.log('Result found:', result.status);
                if (result.status === 'in-queue' || result.status === 'in-progress') {
                    setViewMode(true);
                }
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
            {view ? <PageName name="View Submission" /> : <PageName name="Edit Submission" />}

            <div style={{ margin: '-40px 120px' }}>
                {
                    console.log(data)
                }
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
                    <input
                        disabled={view}
                        value={inputs.param1} onChange={(e) => handleChange('param1', e.target.value)} style={{ width: '20%', marginBottom: '10px', backgroundColor: 'white', padding: '5px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Parameter 2:</div>
                    <div style={{ width: '50%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Starting point</div>
                    <input
                        disabled={view}
                        value={inputs.param2} onChange={(e) => handleChange('param2', e.target.value)} style={{ width: '20%', marginBottom: '10px', backgroundColor: 'white', padding: '5px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Parameter 3:</div>
                    <div style={{ width: '50%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Maximum distance for each car</div>
                    <input
                        disabled={view} value={inputs.param3} onChange={(e) => handleChange('param3', e.target.value)} style={{ width: '20%', marginBottom: '10px', backgroundColor: 'white', padding: '5px', textAlign: 'center' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '20%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Name:</div>
                    <div style={{ width: '50%', marginBottom: '10px', backgroundColor: 'lightgray', padding: '5px' }}>Submission's name</div>
                    <input
                        disabled={view}
                        value={inputs.name} onChange={(e) => handleChange('name', e.target.value)} style={{ width: '20%', marginBottom: '10px', backgroundColor: 'white', padding: '5px', textAlign: 'center' }} />
                </div>
            </div>{modalVisible && (
                <>
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        zIndex: 999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
                            maxWidth: '400px',
                            width: '90%',
                            textAlign: 'center',
                        }}>
                            <p style={{ fontSize: '16px', margin: '0 0 20px' }}>{modalMessage}</p>
                            <button
                                onClick={() => setModalVisible(false)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#006400',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}>
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}



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
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderLeft: '2px solid white',
                        borderRight: '2px solid white',
                        flexDirection: 'column'
                    }}

                    disabled={view}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                >
                    <input
                        disabled={view}
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="fileUpload"
                    />
                    <label
                        disabled={view}
                        htmlFor="fileUpload"
                        style={{
                            width: '80%',
                            height: '80%',
                            backgroundColor: 'lightgray',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            textAlign: 'center',
                            padding: '20px',
                            border: '2px dashed gray'
                        }}
                    >
                        {selectedFile ? selectedFile.name : "Drag and drop a file here or click to select"}
                    </label>
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
                    <StyledButton to="/homepage">Return</StyledButton>
                </div>
                {!view && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginRight: '10px' }}>
                        <StyledButton onClick={handleCancel} style={{ padding: '10px' }}>Cancel</StyledButton>
                        <StyledButton onClick={handleDone} style={{ padding: '10px' }}>Done</StyledButton>
                    </div>)
                }
            </div>
        </div>
    )
}

export default EditSubmission;
