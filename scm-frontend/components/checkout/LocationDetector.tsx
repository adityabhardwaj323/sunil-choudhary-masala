import React, { useState } from 'react';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';

type LocationDetectorProps = {
  onLocationSelect: (lat: number, lng: number, addressDetails?: any) => void;
};

export default function LocationDetector({ onLocationSelect }: LocationDetectorProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser. Please enter your address manually.");
      return;
    }
    
    setIsLocating(true);
    setErrorMsg('');
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        
        try {
          const res = await fetch(`/api/location/reverse-geocode`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude: lat, longitude: lng })
          });
          
          if (!res.ok) {
            throw new Error('Geocoding failed');
          }

          const data = await res.json();
          onLocationSelect(lat, lng, data);
        } catch (e) {
          setErrorMsg("Unable to detect your address. Please enter your address manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg("Location permission denied. Please enter your address manually.");
        } else {
          setErrorMsg("Unable to detect your address. Please enter your address manually.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <button 
        type="button" 
        onClick={handleCurrentLocation} 
        disabled={isLocating}
        className="w-full flex items-center justify-center gap-2 bg-charcoal text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-70 shadow-sm"
      >
        {isLocating ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
        {isLocating ? 'Detecting Location...' : 'Use My Current Location'}
      </button>
      
      {errorMsg && (
        <div className="flex items-start gap-2 mt-1 text-sm text-brand-red bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
