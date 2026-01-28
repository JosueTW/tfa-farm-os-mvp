'use client';

import { useState, useRef } from 'react';
import { Camera, X, Check, RotateCcw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PhotoCaptureProps {
  onPhotoCapture: (
    file: File,
    metadata: { lat?: number; lng?: number; timestamp: string }
  ) => void;
  maxPhotos?: number;
}

interface CapturedPhoto {
  id: string;
  file: File;
  preview: string;
  lat?: number;
  lng?: number;
  timestamp: string;
}

export function PhotoCapture({ onPhotoCapture, maxPhotos = 5 }: PhotoCaptureProps) {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getLocation = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsCapturing(true);
    setError(null);

    try {
      const location = await getLocation();

      for (const file of Array.from(files)) {
        if (photos.length >= maxPhotos) {
          setError(`Maximum ${maxPhotos} photos allowed`);
          break;
        }

        const photo: CapturedPhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview: URL.createObjectURL(file),
          lat: location?.lat,
          lng: location?.lng,
          timestamp: new Date().toISOString(),
        };

        setPhotos((prev) => [...prev, photo]);
        onPhotoCapture(file, {
          lat: location?.lat,
          lng: location?.lng,
          timestamp: photo.timestamp,
        });
      }
    } catch (err) {
      setError('Failed to capture photo');
      console.error(err);
    } finally {
      setIsCapturing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  return (
    <div className="space-y-4">
      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square">
              <img
                src={photo.preview}
                alt="Captured"
                className="h-full w-full rounded-lg object-cover"
              />
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute -right-1 -top-1 rounded-full bg-error p-1 text-white shadow-md"
              >
                <X className="h-3 w-3" />
              </button>
              {photo.lat && photo.lng && (
                <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-black/50 px-1 py-0.5 text-[10px] text-white">
                  <MapPin className="h-2 w-2" />
                  GPS
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Capture button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={photos.length >= maxPhotos || isCapturing}
      />

      <Button
        variant="outline"
        className="w-full h-16"
        onClick={() => fileInputRef.current?.click()}
        disabled={photos.length >= maxPhotos || isCapturing}
      >
        <Camera className="mr-2 h-6 w-6" />
        {isCapturing
          ? 'Capturing...'
          : photos.length >= maxPhotos
          ? `Max ${maxPhotos} photos reached`
          : `Take Photo (${photos.length}/${maxPhotos})`}
      </Button>

      {/* Error message */}
      {error && <p className="text-sm text-center text-error">{error}</p>}

      {/* Instructions */}
      <p className="text-xs text-center text-tfa-text-muted">
        Photos will be tagged with GPS location and timestamp
      </p>
    </div>
  );
}
