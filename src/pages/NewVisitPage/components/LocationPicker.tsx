import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialPos?: [number, number];
}

export const LocationPicker = ({ onLocationSelect, initialPos }: LocationPickerProps) => {
    const [position, setPosition] = useState<[number, number] | null>(initialPos || null);

    const MapEvents = () => {
        useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onLocationSelect(lat, lng);
        },
        });
        return position ? <Marker position={position} /> : null;
    };

    return (
        <div className="map-picker-container" style={{ height: '300px', borderRadius: '12px', overflow: 'hidden' }}>
        <MapContainer center={initialPos || [-5.1483, -38.0991]} zoom={15} style={{ height: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapEvents />
        </MapContainer>
        <p className="map-help-text">Clique no mapa para marcar o local da visita</p>
        </div>
    );
};