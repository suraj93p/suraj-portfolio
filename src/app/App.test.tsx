import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { AppErrorBoundary } from './AppErrorBoundary';
import { getPortfolio } from '../models/portfolio.repository';
import { ProjectCard } from '../views/components/ProjectCard';
import { ExperienceSection } from '../views/sections/ExperienceSection';
import { experienceDisplay } from '../models/portfolio.selectors';
import { Notice } from '../views/components/Notice';
const data = getPortfolio();

describe('portfolio composition', () => {
  it('renders the complete supplied profile without optional placeholders', () => {
    const { container } = render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(data.hero.heading);
    expect(container.querySelectorAll('[data-experience-item]')).toHaveLength(7);
    expect(container.querySelectorAll('[data-project-card]')).toHaveLength(2);
    expect(screen.getByText('Contract through Virtusa')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByText(/download resume/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/suraj93p');
  });
  it('filters by organisation and announces the result count', async () => {
    const user = userEvent.setup(); render(<App />);
    const filters = screen.getByRole('group', { name: data.ui.experienceFilterLabel });
    const google = within(filters).getByRole('button', { name: 'Google (GFiber)' });
    await user.click(google); expect(google).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('1 role shown')).toBeInTheDocument(); expect(google).toHaveFocus();
    await user.click(within(filters).getByRole('button', { name: 'All', exact: true }));
    expect(screen.getByText('7 roles shown')).toBeInTheDocument();
  });
  it('opens and closes the navigation without trapping focus', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.click(screen.getByRole('button', { name: data.ui.openMenu }));
    const toggle = screen.getByRole('button', { name: data.ui.closeMenu });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}'); expect(toggle).toHaveFocus(); expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle); fireEvent.pointerDown(screen.getByRole('heading', { level: 1 })); expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
  it('moves keyboard navigation to a real heading', async () => {
    render(<App />); const nav = screen.getByRole('navigation', { name: data.ui.primaryNavigationLabel });
    fireEvent.click(within(nav).getByRole('link', { name: 'About' }), { detail: 0 });
    await waitFor(() => expect(screen.getByRole('heading', { name: data.about.heading })).toHaveFocus());
  });
  it('copies the visible address and reports success', async () => {
    const user = userEvent.setup(); const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined); render(<App />);
    await user.click(screen.getByRole('button', { name: data.contact.copyActionLabel }));
    expect(write).toHaveBeenCalledWith(data.profile.email); expect(await screen.findByText(data.ui.emailCopied)).toBeInTheDocument();
  });
  it('keeps the email selectable when copying is denied', async () => {
    const user = userEvent.setup(); vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied')); render(<App />);
    await user.click(screen.getByRole('button', { name: data.contact.copyActionLabel }));
    expect(await screen.findByText(data.ui.emailCopyFailed)).toBeInTheDocument(); expect(screen.getByText(data.profile.email)).toBeInTheDocument();
  });
  it('expands project details and restores print-only expansion', async () => {
    const user = userEvent.setup(); const { container } = render(<App />);
    const detail = container.querySelector<HTMLDetailsElement>('[data-project-card] details');
    expect(detail?.open).toBe(false); await user.click(screen.getAllByText(data.ui.projectDetails)[0]); expect(detail?.open).toBe(true);
    await user.click(screen.getAllByText(data.ui.projectDetails)[0]);
    await user.click(screen.getByRole('button', { name: data.footer.printLabel })); expect(window.print).toHaveBeenCalled();
    expect(detail?.open).toBe(true); fireEvent(window, new Event('afterprint')); expect(detail?.open).toBe(false);
  });
  it('does not show an unsupported installation prompt button', () => {
    render(<App />); expect(screen.queryByRole('button', { name: data.ui.installLabel })).not.toBeInTheDocument();
    expect(screen.getByText(data.ui.installHelpLabel)).toBeInTheDocument();
  });
});
describe('component boundaries and exceptional states', () => {
  it('renders an empty-filter recovery action', async () => {
    const reset = vi.fn(); render(<ExperienceSection config={data} items={data.experience.map((item) => experienceDisplay(item, data))} selected="missing" countLabel="0 roles shown" empty onSelect={vi.fn()} onReset={reset} />);
    await userEvent.click(screen.getByRole('button', { name: data.ui.resetFilters })); expect(reset).toHaveBeenCalledOnce();
  });
  it('omits disabled project details and keeps unknown stacks empty', () => {
    const { container } = render(<ProjectCard project={data.projects[1]} index={1} detailsEnabled={false} ui={data.ui} />);
    expect(container.querySelector('details')).toBeNull(); expect(container.querySelector('a')).toBeNull(); expect(screen.queryByText('Python')).not.toBeInTheDocument();
  });
  it('supports genuine optional project destinations', () => {
    render(<ProjectCard project={{ ...data.projects[0], links: [{ id: 'sample', label: 'Project source', href: 'https://github.com/suraj93p', kind: 'external' }] }} index={0} detailsEnabled ui={data.ui} />);
    expect(screen.getByRole('link', { name: /Project source/ })).toHaveAttribute('target', '_blank');
  });
  it('renders one actionable update notice and respects its busy state', async () => {
    const update = vi.fn(); const dismiss = vi.fn(); const { rerender } = render(<Notice notice={{ kind: 'update', message: data.ui.updateAvailable, busy: false }} ui={data.ui} onUpdate={update} onDismiss={dismiss} />);
    await userEvent.click(screen.getByRole('button', { name: data.ui.updateAction })); expect(update).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole('button', { name: data.ui.updateLater })); expect(dismiss).toHaveBeenCalledOnce();
    rerender(<Notice notice={{ kind: 'update', message: data.ui.updateAvailable, busy: true }} ui={data.ui} onUpdate={update} onDismiss={dismiss} />);
    expect(screen.getByRole('button', { name: data.ui.updating })).toBeDisabled();
  });
  it('dismisses offline notices and renders nothing when quiet', async () => {
    const dismiss = vi.fn(); const { rerender, container } = render(<Notice notice={{ kind: 'offline', message: data.ui.offlineNotice, busy: false }} ui={data.ui} onUpdate={vi.fn()} onDismiss={dismiss} />);
    await userEvent.click(screen.getByRole('button', { name: data.ui.dismissNotice })); expect(dismiss).toHaveBeenCalledOnce();
    rerender(<Notice notice={null} ui={data.ui} onUpdate={vi.fn()} onDismiss={dismiss} />); expect(container).toBeEmptyDOMElement();
  });
  it('shows an honest error-boundary contact fallback', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    function Broken(): never { throw new Error('Test render failure'); }
    render(<AppErrorBoundary config={data}><Broken /></AppErrorBoundary>);
    expect(screen.getByRole('heading', { name: data.ui.appErrorHeading })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: data.profile.email })).toHaveAttribute('href', `mailto:${data.profile.email}`);
  });
});
