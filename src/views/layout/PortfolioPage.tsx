import type { ReactNode } from 'react';
import styles from './PortfolioPage.module.scss';
export function PortfolioPage({ header, children, footer, notice }: { header: ReactNode; children: ReactNode; footer: ReactNode; notice: ReactNode }) {
  return <div className={styles.page}>{header}<main id="main-content" tabIndex={-1}>{children}</main>{footer}{notice}</div>;
}
