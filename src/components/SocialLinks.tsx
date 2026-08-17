"use client";

import { Mail } from "lucide-react";

// Real brand SVGs — lucide-react doesn't include social brand icons
function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export const SOCIAL_LINKS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "/in/sahil-sanjay-bhagat",
    href: "https://www.linkedin.com/in/sahil-sanjay-bhagat/",
    Icon: LinkedinIcon,
  },
  {
    id: "github",
    label: "GitHub",
    handle: "sahilbhagat30",
    href: "https://github.com/sahilbhagat30",
    Icon: GithubIcon,
  },
  {
    id: "email",
    label: "Email",
    handle: "sahilbhagat1497@gmail.com",
    href: "mailto:sahilbhagat1497@gmail.com",
    Icon: ({ size = 16 }: { size?: number }) => <Mail size={size} />,
  },
];

/** Compact icon-only row — used in Navbar and Hero */
export function SocialIconRow({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
        <a
          key={id}
          href={href}
          target={href.startsWith("mailto") ? undefined : "_blank"}
          rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
          aria-label={label}
          className="text-white/40 hover:text-white transition-colors duration-200"
        >
          <Icon size={size} />
        </a>
      ))}
    </div>
  );
}

/** Text + icon row — used in Hero landing panel */
export function SocialTextRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {SOCIAL_LINKS.map(({ id, label, href, Icon }, i) => (
        <span key={id} className="flex items-center gap-4">
          {i > 0 && <span className="text-white/15">·</span>}
          <a
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
            aria-label={label}
            className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors duration-200 text-xs tracking-widest uppercase"
          >
            <Icon size={13} />
            {label}
          </a>
        </span>
      ))}
    </div>
  );
}

/** Card grid — used in Contact section */
export function SocialCardGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col sm:flex-row justify-center gap-4 ${className}`}>
      {SOCIAL_LINKS.map(({ id, label, handle, href, Icon }) => (
        <a
          key={id}
          href={href}
          target={href.startsWith("mailto") ? undefined : "_blank"}
          rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
          aria-label={label}
          className="group flex items-center gap-4 px-6 py-4 rounded-2xl glass-card hover:border-white/20 transition-all duration-300"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <span className="text-white/60 group-hover:text-white transition-colors">
              <Icon size={18} />
            </span>
          </div>
          <div className="text-left">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
              {handle}
            </p>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="ml-auto text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      ))}
    </div>
  );
}
