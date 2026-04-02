'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChatHistoryPage() {
  return (
    <div className="flex flex-col h-full bg-surface text-white/90 overflow-hidden font-outfit">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-2xl font-bold text-white">Chat History</h1>
        <p className="text-white/60">Browse your conversation history with the AI assistant</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-effect border-white/10 bg-white/2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                The chat history feature is currently under development.
                In the meantime, your conversations are saved and accessible through the sidebar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}