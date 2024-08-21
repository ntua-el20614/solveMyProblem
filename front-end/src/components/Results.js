import React from 'react';

function parseOutput(output) {
    const routeRegex = /Route for vehicle (\d+):([^]+?)Distance of the route: (\d+)m/g;
    let match;
    const routes = [];
    let maxDistance = 0;

    while ((match = routeRegex.exec(output))) {
        const [_, vehicle, routeDetail, distance] = match;
        const distanceNum = parseInt(distance, 10);
        if (distanceNum > maxDistance) {
            maxDistance = distanceNum;
        }
        routes.push({
            vehicle,
            routeDetail: routeDetail.trim(),
            distance: distanceNum,
        });
    }

    return { routes, maxDistance };
}

function Results({ data }) {
    const { routes, maxDistance } = parseOutput(data.output_file);

    if (!routes.length) {
        return <div>No results or invalid data provided.</div>;
    }

    return (
        <div style={{ width: '100%', overflowX: 'auto', padding: '10px 0' }}>
            {routes.map(({ vehicle, routeDetail, distance }) => (
                <div key={vehicle} style={{
                    display: 'flex',
                    background: distance === maxDistance ? '#ffcccb' : '#f0f0f0',
                    padding: '10px 20px',
                    margin: '5px 0',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ minWidth: '120px', fontWeight: 'bold' }}>Vehicle {vehicle}:</div>
                    <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ marginRight: '20px' }}><strong>Distance:</strong> {distance.toLocaleString()}m</span>
                        <div style={{ maxWidth: '440px', overflowX: 'auto', whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '5px', background: '#e0e0e0' }}>
                            <strong>Route:</strong> {routeDetail}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Results;
