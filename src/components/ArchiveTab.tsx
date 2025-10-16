import { useState } from "react";
import { FileText, Mic, Play, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Entry {
  type: 'text' | 'audio';
  content?: string;
  duration?: number;
  timestamp: Date;
}

interface ArchiveTabProps {
  entries: Entry[];
}

export const ArchiveTab = ({ entries }: ArchiveTabProps) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<{ [key: number]: number }>({});

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (index: number, duration: number) => {
    if (playingIndex === index) {
      // Stop current playback
      setPlayingIndex(null);
      setPlaybackProgress(prev => ({ ...prev, [index]: 0 }));
    } else {
      // Start new playback
      setPlayingIndex(index);
      setPlaybackProgress(prev => ({ ...prev, [index]: 0 }));
      
      // Mock playback progress
      const interval = setInterval(() => {
        setPlaybackProgress(prev => {
          const currentProgress = prev[index] || 0;
          const newProgress = currentProgress + 1;
          
          if (newProgress >= duration) {
            setPlayingIndex(null);
            clearInterval(interval);
            return { ...prev, [index]: 0 };
          }
          
          return { ...prev, [index]: newProgress };
        });
      }, 1000);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
        <div className="text-muted-foreground space-y-2">
          <p className="text-lg">No entries yet</p>
          <p className="text-sm">Start journaling to see your entries here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-3 overflow-y-auto animate-fade-in">
      {entries.map((entry, index) => (
        <Card 
          key={index} 
          className="p-4 hover:shadow-md transition-shadow bg-card border-border"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 text-primary">
              {entry.type === 'text' ? (
                <FileText className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-xs text-muted-foreground">
                {formatDate(entry.timestamp)}
              </div>
              {entry.type === 'text' ? (
                <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                  {entry.content}
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-foreground">
                      Voice entry • {formatDuration(entry.duration || 0)}
                    </div>
                    <Button
                      onClick={() => handlePlayPause(index, entry.duration || 0)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      {playingIndex === index ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {playingIndex === index && (
                    <div className="space-y-1">
                      <div className="w-full bg-muted rounded-full h-1">
                        <div 
                          className="bg-primary h-1 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${((playbackProgress[index] || 0) / (entry.duration || 1)) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDuration(playbackProgress[index] || 0)} / {formatDuration(entry.duration || 0)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
