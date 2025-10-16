import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenLine, Mic, Archive } from "lucide-react";
import { WriteTab } from "@/components/WriteTab";
import { SpeakTab } from "@/components/SpeakTab";
import { ArchiveTab } from "@/components/ArchiveTab";

interface Entry {
  type: 'text' | 'audio';
  content?: string;
  duration?: number;
  timestamp: Date;
}

const Index = () => {
  const [entries, setEntries] = useState<Entry[]>(() => {
    const saved = localStorage.getItem('journl-entries');
    if (saved) {
      return JSON.parse(saved).map((e: Entry) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('journl-entries', JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = (entry: Entry) => {
    setEntries(prev => [entry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[600px] bg-card rounded-3xl shadow-xl overflow-hidden border border-border">
        <div className="flex flex-col h-full">
          <header className="p-6 pb-4 border-b border-border">
            <h1 className="text-3xl font-light text-foreground text-center tracking-wide">
              Journl
            </h1>
          </header>

          <Tabs defaultValue="write" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 m-4 mb-0">
              <TabsTrigger value="write" className="gap-2">
                <PenLine className="h-4 w-4" />
                Write
              </TabsTrigger>
              <TabsTrigger value="speak" className="gap-2">
                <Mic className="h-4 w-4" />
                Speak
              </TabsTrigger>
              <TabsTrigger value="archive" className="gap-2">
                <Archive className="h-4 w-4" />
                Archive
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="flex-1 m-0">
              <WriteTab onSave={handleSaveEntry} />
            </TabsContent>

            <TabsContent value="speak" className="flex-1 m-0">
              <SpeakTab onSave={handleSaveEntry} />
            </TabsContent>

            <TabsContent value="archive" className="flex-1 m-0">
              <ArchiveTab entries={entries} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
