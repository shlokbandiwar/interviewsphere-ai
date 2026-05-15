"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Mic, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [voiceDefault, setVoiceDefault] = useState(false);
  const [stressTips, setStressTips] = useState(true);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-light" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="gradient-primary text-white text-lg font-bold">JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm mb-2 block">Full Name</Label>
                <Input id="name" defaultValue="John Doe" className="h-11 rounded-xl bg-muted/50 border-border" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm mb-2 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" defaultValue="john.doe@example.com" className="pl-10 h-11 rounded-xl bg-muted/50 border-border" />
                </div>
              </div>
            </div>
            <button type="button" className="px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-light" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Email notifications", desc: "Interview reminders and results", checked: emailNotif, onChange: setEmailNotif },
              { label: "Weekly digest", desc: "Performance summary every Monday", checked: weeklyDigest, onChange: setWeeklyDigest },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between p-4 rounded-xl glass">
                <div>
                  <p className="text-sm font-medium">{row.label}</p>
                  <p className="text-xs text-muted-foreground">{row.desc}</p>
                </div>
                <Switch checked={row.checked} onCheckedChange={row.onChange} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Mic className="h-4 w-4 text-purple-light" /> Interview Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Voice mode by default", desc: "Enable microphone on new sessions", checked: voiceDefault, onChange: setVoiceDefault },
              { label: "Stress mode tips", desc: "Show coaching tips during stress interviews", checked: stressTips, onChange: setStressTips },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between p-4 rounded-xl glass">
                <div>
                  <p className="text-sm font-medium">{row.label}</p>
                  <p className="text-xs text-muted-foreground">{row.desc}</p>
                </div>
                <Switch checked={row.checked} onCheckedChange={row.onChange} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-warning" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button type="button" className="w-full text-left p-4 rounded-xl glass glass-hover text-sm font-medium transition-all">
              Change password
            </button>
            <button type="button" className="w-full text-left p-4 rounded-xl glass glass-hover text-sm font-medium text-destructive transition-all">
              Delete account
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
