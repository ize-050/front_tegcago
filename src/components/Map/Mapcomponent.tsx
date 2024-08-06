
'use client'


import { GoogleMap } from "@react-google-maps/api";

//Map's styling
const defaultMapContainerStyle = {
    width: '100%',
    height: '100px',
    borderRadius: '15px 0px 0px 15px',
};

//K2's coordinates
const defaultMapCenter = {
    lat: 13.819930873896553,
    lng: 100.51230584197063
}

//Default zoom level, can be adjusted
const defaultMapZoom = 18

//Map options
const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'satellite',
};

const MapComponent = () => {
    return (
        <div className="w-full">
            <GoogleMap
                mapContainerStyle={defaultMapContainerStyle}
                center={defaultMapCenter}
                zoom={defaultMapZoom}
                options={defaultMapOptions}
            >
            </GoogleMap>
        </div>
    )
};

export default MapComponent;