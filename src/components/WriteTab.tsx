import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface WriteTabProps {
  onSave: (entry: { type: 'text'; content: string; timestamp: Date }) => void;
}

export const WriteTab = ({ onSave }: WriteTabProps) => {
  const [text, setText] = useState("");

  const handleSave = () => {
    if (!text.trim()) {
      toast.error("Please write something before saving");
      return;
    }

    onSave({
      type: 'text',
      content: text,
      timestamp: new Date()
    });

    setText("");
    toast.success("Entry saved!");
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-4 animate-fade-in">
      <Textarea
        placeholder="What's on your mind today?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 resize-none text-base leading-relaxed border-border bg-card focus:ring-primary"
      />
      <Button 
        onClick={handleSave}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        Save Entry
      </Button>
    </div>
  );
};
