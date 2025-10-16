import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface SpeakTabProps {
  onSave: (entry: { type: 'audio'; duration: number; timestamp: Date }) => void;
}

export const SpeakTab = ({ onSave }: SpeakTabProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
      toast.success("Recording stopped");
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      setHasRecording(false);
      toast.info("Recording started");
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 3000); // Mock playback
    }
  };

  const handleSave = () => {
    if (!hasRecording) {
      toast.error("Please record something first");
      return;
    }

    onSave({
      type: 'audio',
      duration: recordingTime,
      timestamp: new Date()
    });

    setHasRecording(false);
    setRecordingTime(0);
    toast.success("Voice entry saved!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="text-4xl font-light text-foreground">
          {formatTime(recordingTime)}
        </div>
        <div className="text-sm text-muted-foreground">
          {isRecording ? "Recording..." : hasRecording ? "Ready to save" : "Tap to start"}
        </div>
      </div>

      {/* Mock Waveform */}
      <div className="flex items-center justify-center gap-1 h-24 w-full">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-primary rounded-full transition-all duration-300 ${
              isRecording ? 'animate-pulse' : ''
            }`}
            style={{
              height: isRecording 
                ? `${Math.random() * 60 + 20}%` 
                : '20%',
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button
          onClick={handleRecord}
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          className="w-full"
        >
          {isRecording ? (
            <>
              <Square className="mr-2 h-5 w-5" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              Start Recording
            </>
          )}
        </Button>

        {hasRecording && (
          <>
            <Button
              onClick={handlePlayPause}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Play
                </>
              )}
            </Button>

            <Button
              onClick={handleSave}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              Save Entry
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
