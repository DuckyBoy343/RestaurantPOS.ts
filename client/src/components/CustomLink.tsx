'use client';

import { useRouter } from 'next/navigation';
import { navigate } from '@/utils/navigate';
import { ReactNode } from 'react';

interface CustomLinkProps {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function CustomLink({ href, className, style, children, onClick }: CustomLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (onClick) {
      onClick(e);
    }
    
    navigate(router, href);
  };

  return (
    <a
      href={href}
      className={className}
      style={{ cursor: 'pointer', ...style }}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}