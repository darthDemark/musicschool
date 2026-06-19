"use client";

import { useState } from "react";
import { User2, Bell, Database, Bot, Youtube, Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { currentUser } from "@/lib/mockData";

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((o) => !o)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        on ? "bg-success" : "bg-line"
      }`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function IntegrationRow({
  icon: Icon,
  name,
  description,
  configured,
}: {
  icon: typeof Database;
  name: string;
  description: string;
  configured: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-line/60 py-4 last:border-0">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-sand text-brass">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-ink">{name}</p>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>
      <span
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
          configured
            ? "bg-success/15 text-success"
            : "bg-amber/15 text-amber"
        }`}
      >
        {configured ? <Check className="h-3.5 w-3.5" /> : null}
        {configured ? "Connected" : "Mock mode"}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Preferences"
        subtitle="Manage your profile, notifications, and integrations."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <User2 className="h-4 w-4 text-brass" />
            <SectionTitle>Profile</SectionTitle>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="label-caps mb-1.5 block">Name</span>
              <input defaultValue={currentUser.name} className="input" />
            </label>
            <label className="block">
              <span className="label-caps mb-1.5 block">Role</span>
              <input defaultValue={currentUser.role} className="input" />
            </label>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-brass" />
            <SectionTitle>Notifications</SectionTitle>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Daily practice reminder</span>
              <Toggle defaultOn />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">New listening assignment</span>
              <Toggle defaultOn />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Streak alerts</span>
              <Toggle />
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-2 flex items-center gap-2">
            <Database className="h-4 w-4 text-brass" />
            <SectionTitle>Integrations</SectionTitle>
          </div>
          <p className="mb-2 text-sm text-muted">
            The prototype runs entirely on mock data. Add the matching environment
            variables (see <code className="rounded bg-sand px-1.5 py-0.5">.env.example</code>) to connect live services.
          </p>
          <div>
            <IntegrationRow
              icon={Bot}
              name="AI Tutor (OpenAI / Anthropic)"
              description="Powers live tutor responses via /api/tutor"
              configured={false}
            />
            <IntegrationRow
              icon={Database}
              name="Supabase"
              description="Persists lessons, songs, hooks, and progress"
              configured={false}
            />
            <IntegrationRow
              icon={Youtube}
              name="YouTube Data API"
              description="Fetches song metadata for Hit Lab"
              configured={false}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
