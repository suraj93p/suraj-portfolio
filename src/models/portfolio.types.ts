/** Public content contract. No private/editorial evidence belongs in this model. */
export type YearMonth = `${number}-${number}`;
export type DateOnly = `${number}-${number}-${number}`;
export type SectionId = 'about' | 'experience' | 'projects' | 'expertise' | 'education' | 'beyond' | 'contact';
export type SourceTagged = { readonly sourceIds: readonly string[] };
export type ImageAsset = { readonly path: string; readonly alt: string };
export type AssetLink = { readonly path: string; readonly label: string };
export type ExternalLink = {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly kind: 'external';
};
export type SectionCopy = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly intro?: string;
};
export type FeatureKey =
  | 'experienceFilters' | 'projectDetails' | 'pwa' | 'installAction'
  | 'printProfile' | 'contactForm' | 'analytics' | 'testimonials'
  | 'blog' | 'resumeDownload' | 'projectScreenshots';
export type FeatureFlags = Readonly<Record<FeatureKey, boolean>>;
export type HeroFact = {
  readonly id: string;
  readonly label: string;
} & (
  | { readonly valueKind: 'text'; readonly value: string }
  | { readonly valueKind: 'careerYears' | 'currentCompany' | 'location'; readonly value: null }
);
export type ExperienceBase = SourceTagged & {
  readonly id: string;
  readonly company: string;
  readonly role: string;
  readonly startDate: YearMonth;
  readonly endDate: YearMonth | null;
  readonly location: string;
  readonly summary: string;
  readonly contributions: readonly string[];
  readonly technologies: readonly string[];
  readonly transitionNote: string | null;
};
export type Experience = ExperienceBase & (
  | { readonly engagement: 'employment'; readonly contractingCompany: null }
  | { readonly engagement: 'contract'; readonly contractingCompany: string }
);
export type Project = SourceTagged & {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly featured: boolean;
  readonly visible: boolean;
  readonly kind: 'professional' | 'personal';
  readonly experienceId: string | null;
  readonly statusLabel: string | null;
  readonly summary: string;
  readonly context: string;
  readonly contribution: string;
  readonly result: string;
  readonly technologies: readonly string[];
  readonly scopeTags: readonly string[];
  readonly links: readonly ExternalLink[];
  readonly image: ImageAsset | null;
};
export type ExpertiseGroup = SourceTagged & {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly primary: readonly string[];
  readonly secondary: readonly string[];
};
export type Education = SourceTagged & {
  readonly id: string;
  readonly institution: string;
  readonly qualification: string;
  readonly field: string;
  readonly startDate: YearMonth;
  readonly endDate: YearMonth;
  readonly summary: string;
};
export type Interest = SourceTagged & {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly icon: 'running' | 'book' | 'mentorship';
};
export type UiKey =
  | 'skipToContent' | 'primaryNavigationLabel' | 'openMenu' | 'closeMenu'
  | 'experienceFilterLabel' | 'allExperienceLabel' | 'experienceCount' | 'experienceCountSingular'
  | 'noExperience' | 'resetFilters' | 'contractTemplate' | 'present'
  | 'projectDetails' | 'contextLabel' | 'contributionLabel' | 'resultLabel'
  | 'moreTools' | 'emailCopied' | 'emailCopyFailed' | 'externalLinkSuffix'
  | 'installLabel' | 'installHelpLabel' | 'installHelpText' | 'installDismissed'
  | 'offlineNotice' | 'offlineReady' | 'updateAvailable' | 'updateAction'
  | 'updateLater' | 'updateFailed' | 'dismissNotice' | 'appErrorHeading'
  | 'appErrorBody' | 'reload' | 'noScriptHeading' | 'noScriptNote'
  | 'profileCardTitle' | 'profileCardLabel' | 'viewExperience' | 'currentRoleLabel'
  | 'roleLabel' | 'careerLabel' | 'toolkitLabel' | 'projectsLabel' | 'aboutLabel'
  | 'copyingEmail' | 'copiedButton' | 'updating' | 'installing' | 'installFailed'
  | 'professionalProject' | 'yearSeparator' | 'profileHomeLabel' | 'educationPeriodLabel'
  | 'pwaStatusLabel' | 'contactLinkLabel' | 'footerNote' | 'offlineUncached'
  | 'updateCheckLabel' | 'updateChecking' | 'updateCurrent' | 'updateCheckFailed'
  | 'resumeLabel' | 'readProfileLabel' | 'navContactLabel';
export type UiCopy = Readonly<Record<UiKey, string>>;
export type PwaConfig = {
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
  readonly id: string;
  readonly startUrl: string;
  readonly scope: string;
  readonly display: 'standalone';
  readonly orientation: 'any';
  readonly lang: string;
  readonly dir: 'ltr';
  readonly icons: readonly {
    readonly src: string;
    readonly sizes: string;
    readonly type: 'image/png';
    readonly purpose: 'any' | 'maskable';
  }[];
  readonly appleTouchIcon: string;
  readonly shortcuts: readonly { readonly name: string; readonly shortName: string; readonly url: string }[];
};
export interface PortfolioConfig {
  readonly schemaVersion: string;
  readonly contentAsOf: DateOnly;
  readonly site: {
    readonly locale: string;
    readonly language: string;
    readonly timeZone: string;
    readonly basePath: string;
    readonly canonicalOrigin: string | null;
    readonly title: string;
    readonly description: string;
    readonly brandText: string;
    readonly shortName: string;
    readonly themeColor: string;
    readonly backgroundColor: string;
    readonly socialImage: ImageAsset;
    readonly indexable: boolean;
  };
  readonly features: FeatureFlags;
  readonly profile: SourceTagged & {
    readonly name: string;
    readonly initials: string;
    readonly location: string;
    readonly roleHeadline: string;
    readonly careerStart: YearMonth;
    readonly currentExperienceId: string;
    readonly email: string;
    readonly socialLinks: readonly ExternalLink[];
    readonly resume: AssetLink | null;
    readonly portrait: ImageAsset | null;
    readonly availabilityStatement: string | null;
  };
  readonly navigation: readonly { readonly id: string; readonly label: string; readonly sectionId: SectionId }[];
  readonly hero: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly headingAccent: string;
    readonly intro: string;
    readonly primaryAction: { readonly label: string; readonly kind: 'section'; readonly target: SectionId };
    readonly secondaryAction: { readonly label: string; readonly kind: 'section'; readonly target: SectionId };
    readonly summaryItems: readonly HeroFact[];
  };
  readonly about: SourceTagged & {
    readonly eyebrow: string;
    readonly heading: string;
    readonly paragraphs: readonly string[];
    readonly principles: readonly { readonly id: string; readonly title: string; readonly body: string }[];
  };
  readonly sectionCopy: Readonly<Record<'experience' | 'projects' | 'expertise' | 'education' | 'beyond', SectionCopy>>;
  readonly experience: readonly Experience[];
  readonly projects: readonly Project[];
  readonly expertise: readonly ExpertiseGroup[];
  readonly education: readonly Education[];
  readonly interests: readonly Interest[];
  readonly contact: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly body: string;
    readonly emailActionLabel: string;
    readonly copyActionLabel: string;
  };
  readonly footer: {
    readonly name: string;
    readonly location: string;
    readonly backToTopLabel: string;
    readonly printLabel: string;
    readonly copyrightPrefix: string;
  };
  readonly ui: UiCopy;
  readonly pwa: PwaConfig;
}
