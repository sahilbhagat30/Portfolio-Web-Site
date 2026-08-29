import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'liquid-glass': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { refraction?: boolean | string; interactive?: boolean | string; class?: string; className?: string; appearance?: string }, HTMLElement>;
      'liquid-glass-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { heading?: string; link?: string; refraction?: boolean | string; interactive?: boolean | string; class?: string; className?: string; appearance?: string }, HTMLElement>;
      'liquid-glass-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { href?: string; refraction?: boolean | string; interactive?: boolean | string; class?: string; className?: string; appearance?: string }, HTMLElement>;
    }
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'liquid-glass': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { refraction?: boolean | string; interactive?: boolean | string; class?: string; className?: string; appearance?: string }, HTMLElement>;
        'liquid-glass-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { heading?: string; link?: string; refraction?: boolean | string; interactive?: boolean | string; class?: string; className?: string; appearance?: string }, HTMLElement>;
        'liquid-glass-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { href?: string; refraction?: boolean | string; interactive?: boolean | string; class?: string; className?: string; appearance?: string }, HTMLElement>;
      }
    }
  }
}
