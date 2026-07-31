import React from 'react';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  return (
    <div className={`reveal ${className}`.trim()} data-reveal-delay={delay}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function Body({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`body-copy ${className}`}>{children}</p>;
}

export function PullQuote({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`pull-quote ${className}`}>{children}</p>;
}
