import { FileText, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";

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
                <div className="text-sm text-foreground">
                  Voice entry • {formatDuration(entry.duration || 0)}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
