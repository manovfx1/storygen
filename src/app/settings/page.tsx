"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Key, Bell, CreditCard, Shield, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "api", label: "API Keys", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [name, setName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex@example.com");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });

  return (
    <DashboardLayout>
      <div className="flex h-full">
        {/* Settings sidebar */}
        <div className="w-56 border-r border-border/60 glass-panel p-4 shrink-0">
          <h2 className="text-xs font-semibold text-text-dim uppercase tracking-wider mb-4 px-3">Settings</h2>
          <nav className="space-y-1">
            {settingsSections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  activeSection === id
                    ? "bg-accent/10 backdrop-blur-sm text-accent border-l-2 border-accent glass-border-glow"
                    : "text-text-muted hover:text-text hover:bg-white/[0.04] hover:backdrop-blur-sm"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto max-w-2xl">
          {activeSection === "profile" && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-6">Profile Settings</h2>
              <div className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/30 flex items-center justify-center">
                    <span className="text-accent text-xl font-bold">A</span>
                  </div>
                  <div>
                    <button className="text-sm text-accent hover:underline">Change avatar</button>
                    <p className="text-xs text-text-dim mt-0.5">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                {[
                  { label: "Full Name", value: name, setter: setName },
                  { label: "Email", value: email, setter: setEmail },
                ].map(({ label, value, setter }) => (
                  <div key={label}>
                    <label className="text-xs text-text-muted font-medium mb-1.5 block">{label}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg glass-input text-sm text-text focus:border-accent/50 focus:outline-none transition-all"
                    />
                  </div>
                ))}

                <button className="btn-generate px-6 py-2.5 rounded-lg text-sm font-semibold text-white">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === "api" && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-6">API Keys</h2>
              <div className="space-y-4">
                {[
                  { name: "OpenAI", key: "sk-...••••••••••••••••abcd", active: true },
                  { name: "Gemini AI", key: "AIza...••••••••••••••••efgh", active: true },
                  { name: "Runway ML", key: "rw-...••••••••••••••••ijkl", active: false },
                ].map((api) => (
                  <div key={api.name} className="flex items-center justify-between p-4 rounded-xl glass-card">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text">{api.name}</p>
                        <span className={cn(
                          "text-xs px-1.5 py-0.5 rounded font-medium",
                          api.active ? "bg-accent/20 text-accent" : "glass-chip text-text-dim"
                        )}>
                          {api.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-text-dim mt-0.5 font-mono">{api.key}</p>
                    </div>
                    <button className="text-xs text-accent hover:underline">Edit</button>
                  </div>
                ))}
                <button className="w-full py-3 rounded-xl border border-dashed border-border text-sm text-text-muted hover:border-accent/40 hover:text-accent transition-all">
                  + Add new API key
                </button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-6">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  { key: "email" as const, label: "Email notifications", sub: "Get notified via email when generation completes" },
                  { key: "push" as const, label: "Push notifications", sub: "Browser push notifications for real-time updates" },
                  { key: "weekly" as const, label: "Weekly digest", sub: "Receive a weekly summary of your creations" },
                ].map(({ key, label, sub }) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl glass-card">
                    <div>
                      <p className="text-sm font-medium text-text">{label}</p>
                      <p className="text-xs text-text-muted mt-0.5">{sub}</p>
                    </div>
                    <button
                      onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className={cn(
                        "w-11 h-6 rounded-full transition-all relative",
                        notifications[key] ? "bg-accent" : "glass-chip"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                        notifications[key] ? "left-6" : "left-1"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "billing" && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-6">Billing & Plans</h2>
              <div className="grid gap-4">
                {[
                  { name: "Free", price: "$0", features: ["5 images/day", "2 videos/day", "720p resolution"], current: true, pro: false },
                  { name: "Pro", price: "$19/mo", features: ["Unlimited images", "20 videos/day", "4K resolution", "Priority queue"], current: false, pro: true },
                ].map((plan) => (
                  <div key={plan.name} className={cn(
                    "p-5 rounded-xl border transition-all",
                    plan.pro ? "border-accent glass-card bg-accent/5" : "glass-card"
                  )}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{plan.name}</h3>
                        <p className="text-accent text-lg font-bold">{plan.price}</p>
                      </div>
                      {plan.current && (
                        <span className="text-xs px-2 py-1 rounded-full glass-chip text-text-muted">Current plan</span>
                      )}
                    </div>
                    <ul className="space-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-text-muted">
                          <Check className="w-3.5 h-3.5 text-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {!plan.current && (
                      <button className="btn-generate w-full py-2.5 rounded-lg text-sm font-semibold text-white mt-4">
                        Upgrade to Pro
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-6">Security</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl glass-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">Change Password</p>
                      <p className="text-xs text-text-dim mt-0.5">Last changed 3 months ago</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </div>
                </div>
                <div className="p-4 rounded-xl glass-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">Two-Factor Authentication</p>
                      <p className="text-xs text-text-dim mt-0.5">Add an extra layer of security</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded glass-chip text-text-dim">Disabled</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl glass-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">Active Sessions</p>
                      <p className="text-xs text-text-dim mt-0.5">2 active sessions</p>
                    </div>
                    <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke all</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
