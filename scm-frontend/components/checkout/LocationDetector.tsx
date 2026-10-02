import React, { useState } from 'react';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';

type LocationDetectorProps = {
  onLocationSelect: (lat: number, lng: number, accuracy: number | undefined, addressDetails?: any) => void;
};

export default function LocationDetector({ onLocationSelect }: LocationDetectorProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser. Please enter your address manually.");
      return;
    }
    
    setIsLocating(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        
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
          onLocationSelect(lat, lng, accuracy, data);
          setSuccessMsg('Location detected.');
        } catch (e) {
          onLocationSelect(lat, lng, accuracy, null);
          setErrorMsg("Your location was detected. We couldn't automatically fill the address, so please confirm or enter your address manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg("Location permission was denied. Please enter your address manually.");
        } else if (error.code === error.TIMEOUT) {
          setErrorMsg("Location detection timed out. Please try again or enter your address manually.");
        } else {
          setErrorMsg("Unable to detect your location. Please enter your address manually.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
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

      {successMsg && !errorMsg && (
        <div className="flex items-start gap-2 mt-1 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}
    </div>
  );
}
