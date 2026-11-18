import { usePortfolioController } from '../controllers/usePortfolioController';
import { useNavigationController } from '../controllers/useNavigationController';
import { useExperienceController } from '../controllers/useExperienceController';
import { useContactController } from '../controllers/useContactController';
import { usePwaController } from '../controllers/usePwaController';
import { useNoticeController } from '../controllers/useNoticeController';
import { usePrintController } from '../controllers/usePrintController';
import { roleCount } from '../models/portfolio.selectors';
import { PortfolioPage } from '../views/layout/PortfolioPage';
import { SiteHeader } from '../views/layout/SiteHeader';
import { SiteFooter } from '../views/layout/SiteFooter';
import { HeroSection } from '../views/sections/HeroSection';
import { AboutSection } from '../views/sections/AboutSection';
import { ExperienceSection } from '../views/sections/ExperienceSection';
import { ProjectsSection } from '../views/sections/ProjectsSection';
import { ExpertiseSection } from '../views/sections/ExpertiseSection';
import { EducationSection } from '../views/sections/EducationSection';
import { BeyondSection } from '../views/sections/BeyondSection';
import { ContactSection } from '../views/sections/ContactSection';
import { Notice } from '../views/components/Notice';

export function App() {
  const { config, facts, experience, projects, education, year } = usePortfolioController();
  const navigation = useNavigationController(config.navigation);
  const career = useExperienceController(experience);
  const contact = useContactController(config.profile.email);
  const pwa = usePwaController(config.features.pwa, config.features.installAction, config.ui);
  const print = usePrintController();
  const noticePosition = useNoticeController(Boolean(pwa.notice));
  return <PortfolioPage
    header={<SiteHeader config={config} isMenuOpen={navigation.isMenuOpen} activeSectionId={navigation.activeSectionId} headerRef={navigation.headerRef} toggleRef={navigation.toggleRef} onToggle={navigation.toggleMenu} onNavigate={navigation.onNavigate} />}
    footer={<SiteFooter config={config} year={year} onPrint={print} onNavigate={navigation.onNavigate} canInstall={pwa.canInstall} onInstall={() => { void pwa.install(); }} installing={pwa.installing} installMessage={pwa.installMessage} showInstallHelp={pwa.showInstallHelp} updateDeferred={pwa.updateDeferred} onUpdate={() => { void pwa.update(); }} updating={pwa.updating} />}
    notice={<Notice noticeRef={noticePosition.noticeRef} placement={noticePosition.placement} notice={pwa.notice} ui={config.ui} onUpdate={() => { void pwa.update(); }} onDismiss={pwa.dismissNotice} />}
  >
    <HeroSection config={config} facts={facts} onNavigate={navigation.onNavigate} />
    <AboutSection about={config.about} />
    <ExperienceSection config={config} items={experience} selected={career.selectedCompanyId} countLabel={roleCount(career.visibleExperience.length, config.ui)} empty={career.visibleExperience.length === 0} onSelect={career.selectCompany} onReset={career.reset} />
    <ProjectsSection config={config} projects={projects} />
    <ExpertiseSection config={config} />
    <EducationSection config={config} items={education} />
    <BeyondSection config={config} />
    <ContactSection config={config} copyStatus={contact.copyStatus} onCopy={() => { void contact.copyEmail(); }} />
  </PortfolioPage>;
}
