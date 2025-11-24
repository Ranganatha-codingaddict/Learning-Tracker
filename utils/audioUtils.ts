
import { useCallback, useEffect, useRef } from 'react';

// For mocking purposes, we'll use placeholder audio files.
// In a real application, you'd host actual short sound files (.mp3, .wav)
const audioFiles = {
  start: 'https://www.soundjay.com/button/button-1.mp3', // Example: short button click
  end: 'https://www.soundjay.com/misc/fail-buzzer-01.mp3', // Example: buzzer/ding
  alert: 'https://www.soundjay.com/misc/bell-ring-01.mp3', // Example: bell ring
};

const useSound = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Preload audio files
    Object.keys(audioFiles).forEach(key => {
      if (typeof window !== 'undefined') { // Ensure running in browser
        const audio = new Audio((audioFiles as any)[key]);
        audio.load(); // Request to load the audio
        audioRefs.current[key] = audio;
      }
    });

    return () => {
      // Clean up audio objects on unmount
      Object.values(audioRefs.current).forEach((audio: HTMLAudioElement) => {
        audio.pause();
        audio.removeAttribute('src'); // Clear src to release resources
        audio.load(); // This can sometimes stop lingering downloads
      });
      audioRefs.current = {}; // Clear references
    };
  }, []);

  const playSound = useCallback((soundName: 'start' | 'end' | 'alert') => {
    const audio = audioRefs.current[soundName];
    if (audio) {
      audio.currentTime = 0; // Rewind to start
      audio.play().catch(error => {
        // Autoplay policy might block audio if user hasn't interacted yet
        console.warn(`Failed to play sound '${soundName}':`, error.message);
      });
    }
  }, []);

  return playSound;
};

export default useSound;