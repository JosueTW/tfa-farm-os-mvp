'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  maxDuration?: number; // in seconds
}

export function VoiceRecorder({
  onRecordingComplete,
  maxDuration = 120,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const discardRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
  };

  const submitRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob, duration);
      discardRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Recording visualization */}
      {isRecording && (
        <div className="flex items-center justify-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-error animate-pulse"
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <span className="font-mono text-lg text-error">
            {formatTime(duration)}
          </span>
        </div>
      )}

      {/* Recorded audio preview */}
      {audioUrl && !isRecording && (
        <div className="space-y-3">
          <audio src={audioUrl} controls className="w-full" />
          <p className="text-sm text-center text-tfa-text-muted">
            Duration: {formatTime(duration)}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isRecording && !audioBlob && (
          <Button
            size="lg"
            className="h-16 w-16 rounded-full bg-error hover:bg-error/90"
            onClick={startRecording}
          >
            <Mic className="h-8 w-8" />
          </Button>
        )}

        {isRecording && (
          <Button
            size="lg"
            className="h-16 w-16 rounded-full bg-tfa-bg-tertiary hover:bg-tfa-bg-elevated"
            onClick={stopRecording}
          >
            <Square className="h-8 w-8 text-error" />
          </Button>
        )}

        {audioBlob && !isRecording && (
          <>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6"
              onClick={discardRecording}
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Discard
            </Button>
            <Button
              size="lg"
              className="h-12 px-6 bg-tfa-primary hover:bg-tfa-primary-dark"
              onClick={submitRecording}
            >
              <Send className="mr-2 h-5 w-5" />
              Send
            </Button>
          </>
        )}
      </div>

      {/* Instructions */}
      {!isRecording && !audioBlob && (
        <p className="text-center text-sm text-tfa-text-muted">
          Tap to start recording your update
        </p>
      )}

      {isRecording && (
        <p className="text-center text-sm text-error animate-pulse">
          Recording... Tap to stop
        </p>
      )}
    </div>
  );
}
