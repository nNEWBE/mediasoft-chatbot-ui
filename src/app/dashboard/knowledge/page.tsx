'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col h-full bg-surface text-white/90 overflow-hidden font-outfit">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
        <p className="text-white/60">Manage your knowledge resources and documents</p>
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
                The knowledge base management feature is currently under development.
                For now, you can manage resources from the context management page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}