import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';
type Variant = 'primary' | 'secondary' | 'light' | 'ghost';
type Common = { children: ReactNode; variant?: Variant; className?: string };
export function Button({ children, variant = 'primary', className = '', ...props }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={`${styles.button} ${styles[variant]} ${className}`} {...props}>{children}</button>;
}
export function LinkButton({ children, variant = 'primary', className = '', ...props }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={`${styles.button} ${styles[variant]} ${className}`} {...props}>{children}</a>;
}
