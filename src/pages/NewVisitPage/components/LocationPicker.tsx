import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialPos?: [number, number];
}

interface MapClickHandlerProps {
    position: [number, number] | null;
    onSelect: (lat: number, lng: number) => void;
}

const MapClickHandler = ({ position, onSelect }: MapClickHandlerProps) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onSelect(lat, lng);
        },
    });

    return position ? <Marker position={position} /> : null;
};

export const LocationPicker = ({ onLocationSelect, initialPos }: LocationPickerProps) => {
    const [position, setPosition] = useState<[number, number] | null>(initialPos || null);

    const handleSelect = (lat: number, lng: number) => {
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
    };

    return (
        <div className="map-picker-container" style={{ height: '300px', borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer center={initialPos || [-5.1483, -38.0991]} zoom={15} style={{ height: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles-auto"
                />
                <MapClickHandler position={position} onSelect={handleSelect} />
            </MapContainer>
            <p className="map-help-text">Clique no mapa para marcar o local da visita</p>
        </div>
    );
};