"use client";

import Link from "next/link";
import { Sparkles, Globe, ExternalLink, Mail } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-primary">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold">
                <span className="gradient-text">{APP_NAME.split(" ")[0]}</span>
                <span className="text-foreground/80"> AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              AI-powered mock interview platform. Practice smarter, interview better.
            </p>
            <div className="flex gap-3">
              {[Globe, ExternalLink, Mail].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-xl glass glass-hover text-muted-foreground hover:text-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
            { title: "Resources", links: ["Documentation", "API", "Blog", "Community"] },
            { title: "Company", links: ["About", "Careers", "Privacy", "Terms"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2025 {APP_NAME}. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built with ❤️ for engineers worldwide</p>
        </div>
      </div>
    </footer>
  );
}
