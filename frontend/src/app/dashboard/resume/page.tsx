"use client";

import { motion } from "framer-motion";
import { FileText, Upload, CheckCircle, Briefcase, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RESUME = {
  filename: "john_doe_resume.pdf",
  uploadedAt: "May 1, 2026",
  name: "John Doe",
  email: "john.doe@example.com",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "System Design"],
  experience: [
    { company: "TechCorp", role: "Senior Frontend Engineer", duration: "2022 — Present", highlights: ["Led design system", "Mentored 3 engineers"] },
    { company: "StartupXYZ", role: "Full Stack Developer", duration: "2020 — 2022", highlights: ["Built MVP from scratch", "Scaled to 50k users"] },
  ],
  education: [
    { institution: "State University", degree: "B.S. Computer Science", year: "2020" },
  ],
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function ResumePage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Resume</h1>
          <p className="text-muted-foreground mt-1">Upload your resume for tailored interview questions.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-indigo/25 hover:shadow-indigo/40 hover:scale-[1.02] transition-all"
        >
          <Upload className="h-4 w-4" /> Upload New
        </button>
      </motion.div>

      <motion.div variants={item}>
        <Card className="glass border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{RESUME.filename}</p>
              <p className="text-xs text-muted-foreground">Uploaded {RESUME.uploadedAt}</p>
            </div>
            <Badge className="bg-success/10 text-success border-0 gap-1">
              <CheckCircle className="h-3 w-3" /> Parsed
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-light" /> Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {RESUME.experience.map((exp) => (
              <div key={exp.company} className="p-4 rounded-xl glass-hover">
                <p className="font-medium">{exp.role}</p>
                <p className="text-sm text-indigo-light">{exp.company}</p>
                <p className="text-xs text-muted-foreground mb-2">{exp.duration}</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {exp.highlights.map((h) => (
                    <li key={h}>• {h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {RESUME.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 rounded-xl text-xs font-medium glass text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-light" /> Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {RESUME.education.map((edu) => (
                <div key={edu.institution} className="p-3 rounded-xl glass-hover">
                  <p className="text-sm font-medium">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">{edu.institution} • {edu.year}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
