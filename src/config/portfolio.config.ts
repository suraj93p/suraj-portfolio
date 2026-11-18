import type { PortfolioConfig } from '../models/portfolio.types';

/** The single source of public portfolio content. Edit this file to update the site. */
export const portfolioConfig = {
  "schemaVersion": "1.0.0",
  "contentAsOf": "2026-11-06",
  "site": {
    "locale": "en-SG",
    "language": "en",
    "timeZone": "Asia/Singapore",
    "basePath": "/",
    "canonicalOrigin": null,
    "title": "Suraj Pasayat | Senior Full Stack Engineer & Frontend Tech Lead",
    "description": "Singapore-based software engineer with frontend technical leadership and full-stack experience across research platforms, business applications and data workflows.",
    "brandText": "SURAJ.",
    "shortName": "Suraj",
    "themeColor": "#0F5F58",
    "backgroundColor": "#F7F8F5",
    "socialImage": {
      "path": "social/og-suraj-pasayat.png",
      "alt": "Suraj Pasayat - Senior Full Stack Engineer and Frontend Tech Lead"
    },
    "indexable": true
  },
  "features": {
    "experienceFilters": true,
    "projectDetails": true,
    "pwa": true,
    "installAction": true,
    "printProfile": true,
    "contactForm": false,
    "analytics": false,
    "testimonials": false,
    "blog": false,
    "resumeDownload": false,
    "projectScreenshots": false
  },
  "profile": {
    "name": "Suraj Pasayat",
    "initials": "SP",
    "location": "Singapore",
    "roleHeadline": "Senior Full Stack Engineer | Frontend Tech Lead",
    "careerStart": "2015-06",
    "currentExperienceId": "edhec",
    "email": "suraj.93p@gmail.com",
    "socialLinks": [
      {
        "id": "linkedin",
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/suraj-pasayat/",
        "kind": "external"
      },
      {
        "id": "github",
        "label": "GitHub",
        "href": "https://github.com/suraj93p",
        "kind": "external"
      }
    ],
    "resume": null,
    "portrait": null,
    "availabilityStatement": null,
    "sourceIds": [
      "P01",
      "P02"
    ]
  },
  "navigation": [
    {
      "id": "nav-about",
      "label": "About",
      "sectionId": "about"
    },
    {
      "id": "nav-experience",
      "label": "Experience",
      "sectionId": "experience"
    },
    {
      "id": "nav-projects",
      "label": "Projects",
      "sectionId": "projects"
    },
    {
      "id": "nav-expertise",
      "label": "Expertise",
      "sectionId": "expertise"
    },
    {
      "id": "nav-contact",
      "label": "Contact",
      "sectionId": "contact"
    }
  ],
  "hero": {
    "eyebrow": "Suraj Pasayat / Singapore",
    "heading": "Building software that makes complex work simpler.",
    "intro": "I am a Senior Full Stack Engineer and Frontend Tech Lead with a background in React, Angular and TypeScript. My work connects thoughtful interfaces, business data and reliable delivery, with a current focus on private assets and infrastructure research.",
    "primaryAction": {
      "label": "Explore my work",
      "kind": "section",
      "target": "projects"
    },
    "secondaryAction": {
      "label": "Get in touch",
      "kind": "section",
      "target": "contact"
    },
    "summaryItems": [
      {
        "id": "experience-years",
        "label": "Years in software engineering",
        "valueKind": "careerYears",
        "value": null
      },
      {
        "id": "current-role",
        "label": "Currently",
        "valueKind": "currentCompany",
        "value": null
      },
      {
        "id": "location",
        "label": "Based in",
        "valueKind": "location",
        "value": null
      },
      {
        "id": "focus",
        "label": "Core focus",
        "valueKind": "text",
        "value": "Frontend + full stack"
      }
    ],
    "headingAccent": "complex work simpler."
  },
  "about": {
    "eyebrow": "About",
    "heading": "Frontend depth. Broader engineering ownership.",
    "paragraphs": [
      "My career began in 2015 and has taken me through financial software, travel technology, e-commerce, ERP, telecommunications and research platforms.",
      "Frontend engineering is the foundation of my work. Over time, my responsibilities have expanded into backend services, databases, cloud infrastructure and release delivery.",
      "I care about modular code, clear interfaces, useful tests and documentation that makes software easier to maintain. I enjoy working with research and business teams to turn complex requirements into practical applications."
    ],
    "principles": [
      {
        "id": "clarity",
        "title": "Clarity over cleverness",
        "body": "Readable code, reusable components and explicit responsibilities."
      },
      {
        "id": "delivery",
        "title": "Ownership through delivery",
        "body": "Attention to implementation, testing, releases and operational support."
      },
      {
        "id": "context",
        "title": "Understand the work",
        "body": "Engineering decisions informed by the people and workflows the software supports."
      }
    ],
    "sourceIds": [
      "P01",
      "P03"
    ]
  },
  "sectionCopy": {
    "experience": {
      "eyebrow": "Experience",
      "heading": "A career built across products and platforms.",
      "intro": "From enterprise applications and consumer platforms to private assets research."
    },
    "projects": {
      "eyebrow": "Selected work",
      "heading": "Useful tools. Clear engineering purpose.",
      "intro": "Two projects that connect business users and research workflows with the data they need."
    },
    "expertise": {
      "eyebrow": "Expertise",
      "heading": "A practical engineering toolkit.",
      "intro": "Frontend depth, supported by full-stack delivery, testing and engineering operations."
    },
    "education": {
      "eyebrow": "Education",
      "heading": "A foundation in computer science."
    },
    "beyond": {
      "eyebrow": "Beyond the code",
      "heading": "Learning, movement and good stories."
    }
  },
  "experience": [
    {
      "id": "edhec",
      "company": "EDHEC Infra and Private Assets",
      "role": "Senior Full Stack Engineer",
      "startDate": "2026-04",
      "endDate": null,
      "location": "Singapore",
      "engagement": "employment",
      "contractingCompany": null,
      "summary": "Full-stack engineering for private assets and infrastructure research workflows.",
      "contributions": [
        "Work across frontend systems, backend services, databases, cloud infrastructure and deployment pipelines.",
        "Design and build applications and internal tooling with React, TypeScript, Python, PostgreSQL, MongoDB and AWS.",
        "Own delivery from architecture and implementation through deployment, release management and operational support.",
        "Collaborate directly with research and business teams on cross-functional technical initiatives."
      ],
      "technologies": [
        "React",
        "TypeScript",
        "Python",
        "PostgreSQL",
        "MongoDB",
        "AWS"
      ],
      "transitionNote": "Transitioned from SIPA into EDHEC in April 2026.",
      "sourceIds": [
        "P01"
      ]
    },
    {
      "id": "sipa",
      "company": "Scientific Infra and Private Assets (SIPA)",
      "role": "Senior Frontend Developer & Technical Lead",
      "startDate": "2023-04",
      "endDate": "2026-03",
      "location": "Singapore",
      "engagement": "employment",
      "contractingCompany": null,
      "summary": "Frontend ownership for data, valuation and portfolio analysis products.",
      "contributions": [
        "Served as the sole frontend owner of the data and valuation platform, delivering features with React, Redux-Saga and Ant Design.",
        "Built and maintained an Excel add-in using React and Fluent UI for portfolio analysis workflows.",
        "Introduced shared components, coding standards, peer-review checklists and automated testing.",
        "Worked on AWS CI/CD and coordinated multi-project production releases across departments.",
        "Developed role-based access modules for internal teams."
      ],
      "technologies": [
        "React",
        "Redux-Saga",
        "Ant Design",
        "Fluent UI",
        "Jest",
        "React Testing Library",
        "AWS"
      ],
      "transitionNote": null,
      "sourceIds": [
        "P01"
      ]
    },
    {
      "id": "google-gfiber",
      "company": "Google (GFiber)",
      "role": "Software Engineer",
      "startDate": "2020-10",
      "endDate": "2023-03",
      "location": "Singapore",
      "engagement": "contract",
      "contractingCompany": "Virtusa",
      "summary": "Angular engineering for the GFiber broadband portal, as a Virtusa contractor.",
      "contributions": [
        "Built portal features using Angular and RxJS.",
        "Worked on lazy loading, bundle optimisation and application performance.",
        "Wrote design documents and participated in UX architecture discussions and bug triage.",
        "Served as Buildcop and participated in the TypeScript Readability Group."
      ],
      "technologies": [
        "Angular",
        "RxJS",
        "TypeScript"
      ],
      "transitionNote": null,
      "sourceIds": [
        "P01"
      ]
    },
    {
      "id": "deskera",
      "company": "Deskera",
      "role": "Senior Software Engineer I",
      "startDate": "2019-11",
      "endDate": "2020-09",
      "location": "Singapore",
      "engagement": "employment",
      "contractingCompany": null,
      "summary": "Modular frontend development for ERP workflows.",
      "contributions": [
        "Delivered ERP modules using Angular and NgRx, with reusable and consistent components.",
        "Enhanced Sales and Purchase workflows and application loading performance.",
        "Drafted coding guidelines, improved unit testing and conducted code quality audits."
      ],
      "technologies": [
        "Angular",
        "NgRx"
      ],
      "transitionNote": null,
      "sourceIds": [
        "P01"
      ]
    },
    {
      "id": "flipkart",
      "company": "Flipkart",
      "role": "User Interface Engineer I",
      "startDate": "2018-06",
      "endDate": "2019-10",
      "location": "Bengaluru, India",
      "engagement": "employment",
      "contractingCompany": null,
      "summary": "React development for the Seller Dashboard Platform.",
      "contributions": [
        "Developed Seller Dashboard modules and components using React and Redux.",
        "Contributed to improvements in seller onboarding.",
        "Owned CI/CD scripts and testing routines to support release quality."
      ],
      "technologies": [
        "React",
        "Redux"
      ],
      "transitionNote": null,
      "sourceIds": [
        "P01"
      ]
    },
    {
      "id": "amadeus",
      "company": "Amadeus",
      "role": "Software Engineer",
      "startDate": "2016-01",
      "endDate": "2018-06",
      "location": "Bengaluru, India",
      "engagement": "employment",
      "contractingCompany": null,
      "summary": "Travel technology across mobile services and customised agency applications.",
      "contributions": [
        "Developed middleware interfaces for services in the Amadeus Mobile team.",
        "Built custom scripts and dialogs for travel agency clients.",
        "Developed frontend applications using AngularJS and Bootstrap on the Amadeus Platform for Professionals."
      ],
      "technologies": [
        "AngularJS",
        "Bootstrap"
      ],
      "transitionNote": null,
      "sourceIds": [
        "P01"
      ]
    },
    {
      "id": "intellect",
      "company": "Intellect Design Arena Ltd",
      "role": "Consultant",
      "startDate": "2015-06",
      "endDate": "2015-12",
      "location": "Hyderabad, India",
      "engagement": "employment",
      "contractingCompany": null,
      "summary": "Early-career engineering in financial and insurance software.",
      "contributions": [
        "Developed Ext JS frontend components while training in financial and insurance domains.",
        "Collaborated with backend teams on API integration."
      ],
      "technologies": [
        "Ext JS"
      ],
      "transitionNote": null,
      "sourceIds": [
        "P01"
      ]
    }
  ],
  "projects": [
    {
      "id": "excel-add-in",
      "title": "Business data, directly in Excel",
      "category": "Excel add-in",
      "featured": true,
      "visible": true,
      "kind": "professional",
      "experienceId": "sipa",
      "statusLabel": null,
      "summary": "Built an Excel add-in that lets business users access data directly in their spreadsheets.",
      "context": "Business users need access to data within spreadsheet-based analysis workflows.",
      "contribution": "Built and maintained the add-in using React and Fluent UI.",
      "result": "Provided a way to access data inside Excel and support portfolio analysis workflows.",
      "technologies": [
        "React",
        "Fluent UI",
        "Excel JS APIs"
      ],
      "scopeTags": [
        "Spreadsheet workflows",
        "Business data",
        "User interfaces"
      ],
      "links": [],
      "image": null,
      "sourceIds": [
        "P01",
        "P02"
      ]
    },
    {
      "id": "sec-data-pipeline",
      "title": "From SEC filings to structured data",
      "category": "Data pipeline",
      "featured": true,
      "visible": true,
      "kind": "professional",
      "experienceId": null,
      "statusLabel": null,
      "summary": "Built a pipeline that accesses data from SEC filings, normalises it and stores it directly in a database.",
      "context": "Filing data needs to be accessed and normalised before it can be stored in a consistent structure.",
      "contribution": "Built the flow from SEC filing data access through normalisation and database storage.",
      "result": "Made the retrieved data available in a database in normalised form.",
      "technologies": [],
      "scopeTags": [
        "SEC filings",
        "Data normalisation",
        "Database storage"
      ],
      "links": [],
      "image": null,
      "sourceIds": [
        "P02"
      ]
    }
  ],
  "expertise": [
    {
      "id": "frontend",
      "title": "Frontend engineering",
      "description": "Interfaces and application structure across modern and established frontend stacks.",
      "primary": [
        "React",
        "TypeScript",
        "JavaScript",
        "Angular",
        "Redux",
        "NgRx",
        "RxJS"
      ],
      "secondary": [
        "Redux-Saga",
        "Excel JS APIs",
        "AngularJS",
        "Ext JS"
      ],
      "sourceIds": [
        "P01"
      ]
    },
    {
      "id": "interface-systems",
      "title": "UI systems and styling",
      "description": "Reusable components, consistent interactions and maintainable styles.",
      "primary": [
        "SCSS",
        "Ant Design",
        "Fluent UI"
      ],
      "secondary": [
        "Material UI",
        "Bootstrap"
      ],
      "sourceIds": [
        "P01"
      ]
    },
    {
      "id": "full-stack-data",
      "title": "Full-stack and data",
      "description": "Backend services and data storage supporting business and research workflows.",
      "primary": [
        "Python",
        "PostgreSQL",
        "MongoDB"
      ],
      "secondary": [
        "MySQL",
        "API integration"
      ],
      "sourceIds": [
        "P01"
      ]
    },
    {
      "id": "quality",
      "title": "Testing and quality",
      "description": "Automated checks, maintainable tests and review practices.",
      "primary": [
        "Jest",
        "React Testing Library",
        "Playwright",
        "SonarQube"
      ],
      "secondary": [
        "Karma",
        "Jasmine",
        "Automation scripts"
      ],
      "sourceIds": [
        "P01"
      ]
    },
    {
      "id": "delivery",
      "title": "Delivery and operations",
      "description": "Build pipelines, release coordination and production support.",
      "primary": [
        "AWS",
        "Jenkins",
        "Git",
        "CI/CD"
      ],
      "secondary": [
        "Release management",
        "Production support"
      ],
      "sourceIds": [
        "P01"
      ]
    },
    {
      "id": "collaboration",
      "title": "Engineering collaboration",
      "description": "Working with research, business and engineering teams through clear documentation and tools.",
      "primary": [
        "Design documentation",
        "Code reviews",
        "Research collaboration"
      ],
      "secondary": [
        "JIRA",
        "Confluence",
        "Postman",
        "Swagger",
        "VS Code"
      ],
      "sourceIds": [
        "P01"
      ]
    }
  ],
  "education": [
    {
      "id": "nit-raipur",
      "institution": "National Institute of Technology, Raipur",
      "qualification": "Bachelor of Technology",
      "field": "Computer Science and Engineering",
      "startDate": "2011-07",
      "endDate": "2015-05",
      "summary": "Computer science foundations including operating systems, databases, data structures and algorithms.",
      "sourceIds": [
        "P01"
      ]
    }
  ],
  "interests": [
    {
      "id": "running",
      "title": "Running",
      "body": "An interest outside work that keeps me moving.",
      "icon": "running",
      "sourceIds": [
        "P02"
      ]
    },
    {
      "id": "fiction",
      "title": "Reading fiction",
      "body": "Making time for stories beyond the screen.",
      "icon": "book",
      "sourceIds": [
        "P02"
      ]
    },
    {
      "id": "mentorship",
      "title": "Mentorship",
      "body": "I enjoy mentoring engineering students through conversations about problem-solving, computer science, communication and careers.",
      "icon": "mentorship",
      "sourceIds": [
        "P02",
        "P03"
      ]
    }
  ],
  "contact": {
    "eyebrow": "Connect",
    "heading": "Let's talk about useful software.",
    "body": "For engineering opportunities, professional collaborations and conversations about building better products.",
    "emailActionLabel": "Email Suraj",
    "copyActionLabel": "Copy email"
  },
  "footer": {
    "name": "Suraj Pasayat",
    "location": "Singapore",
    "backToTopLabel": "Back to top",
    "printLabel": "Print profile",
    "copyrightPrefix": "Copyright"
  },
  "ui": {
    "skipToContent": "Skip to content",
    "primaryNavigationLabel": "Primary navigation",
    "openMenu": "Open navigation",
    "closeMenu": "Close navigation",
    "experienceFilterLabel": "Filter experience by organisation",
    "allExperienceLabel": "All",
    "experienceCount": "{count} roles shown",
    "experienceCountSingular": "{count} role shown",
    "noExperience": "No roles match this filter.",
    "resetFilters": "Show all experience",
    "contractTemplate": "Contract through {company}",
    "present": "Present",
    "projectDetails": "View project details",
    "contextLabel": "Context",
    "contributionLabel": "My contribution",
    "resultLabel": "What it enables",
    "moreTools": "More tools and experience",
    "emailCopied": "Email address copied.",
    "emailCopyFailed": "Copy was unavailable. Select and copy the email address above.",
    "externalLinkSuffix": "opens in a new tab",
    "installLabel": "Install portfolio",
    "installHelpLabel": "Installation help",
    "installHelpText": "Installation options depend on your browser. Look for Install app or Add to Home Screen in the browser menu. On supported Apple browsers, use the share or page menu.",
    "installDismissed": "Installation was not completed. You can keep using the website.",
    "offlineNotice": "You appear to be offline. Saved portfolio content is still available; external links need a connection.",
    "offlineReady": "Portfolio saved for offline viewing.",
    "updateAvailable": "A newer version of this portfolio is available.",
    "updateAction": "Update now",
    "updateLater": "Later",
    "updateFailed": "The update could not be applied. Keep browsing and try again when connected.",
    "dismissNotice": "Dismiss notice",
    "appErrorHeading": "Something did not load correctly.",
    "appErrorBody": "Reload the page, or contact Suraj using the email address below.",
    "reload": "Reload page",
    "noScriptHeading": "Suraj Pasayat - professional profile",
    "noScriptNote": "The interactive portfolio needs JavaScript. The professional summary and contact links below remain available.",
    "profileCardTitle": "At a glance",
    "profileCardLabel": "Engineering profile",
    "viewExperience": "Explore the journey",
    "currentRoleLabel": "Current role",
    "roleLabel": "Role",
    "careerLabel": "Career",
    "toolkitLabel": "Toolkit",
    "projectsLabel": "Selected projects",
    "aboutLabel": "How I work",
    "copyingEmail": "Copying...",
    "copiedButton": "Copied",
    "updating": "Updating...",
    "installing": "Opening installation...",
    "installFailed": "The installation prompt could not open. Use your browser menu or keep browsing.",
    "professionalProject": "Professional project",
    "yearSeparator": "to",
    "profileHomeLabel": "Suraj Pasayat, back to top",
    "educationPeriodLabel": "Study period",
    "pwaStatusLabel": "Portfolio status",
    "contactLinkLabel": "Professional profiles",
    "footerNote": "Built with care. Kept intentionally simple.",
    "offlineUncached": "You appear to be offline. Some resources may not have been saved yet. External links need a connection.",
    "updateCheckLabel": "Check for updates",
    "updateChecking": "Checking...",
    "updateCurrent": "This portfolio is up to date.",
    "updateCheckFailed": "Could not check for updates. Please try again when connected.",
    "resumeLabel": "Resume",
    "readProfileLabel": "Read profile",
    "navContactLabel": "Let's talk"
  },
  "pwa": {
    "name": "Suraj Pasayat - Portfolio",
    "shortName": "Suraj",
    "description": "Engineering experience, projects and contact details for Suraj Pasayat.",
    "id": "./",
    "startUrl": "./",
    "scope": "./",
    "display": "standalone",
    "orientation": "any",
    "lang": "en",
    "dir": "ltr",
    "icons": [
      {
        "src": "icons/icon-192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "icons/icon-512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "icons/icon-maskable-512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ],
    "appleTouchIcon": "icons/apple-touch-icon-180.png",
    "shortcuts": [
      {
        "name": "Selected work",
        "shortName": "Projects",
        "url": "./#projects"
      },
      {
        "name": "Contact Suraj",
        "shortName": "Contact",
        "url": "./#contact"
      }
    ]
  }
} as const satisfies PortfolioConfig;
