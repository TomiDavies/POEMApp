import { PoemCategory } from './types';

export const POEM_FRAMEWORK: PoemCategory[] = [
  {
    id: 'vision',
    name: 'Vision',
    description: 'Strategic direction: Problem, Solution, Value & Strategy',
    color: '#6366F1',
    subcategories: [
      {
        id: 'problem',
        name: 'Problem',
        description: 'The core problem your startup solves',
        template: `# Problem Statement

## Core Problem
[Describe the fundamental problem your startup is solving]

## Who is Affected?
[Identify the people, businesses, or groups experiencing this problem]

## Current Solutions & Limitations
[How is this problem currently being addressed? What are the gaps?]

## Problem Validation
[Evidence that this problem exists and is significant — data, research, interviews]

## Scale & Urgency
[How widespread is this problem? Why is it critical to solve it now?]

## Root Cause Analysis
[What are the underlying reasons this problem exists?]
`,
      },
      {
        id: 'solution',
        name: 'Solution',
        description: 'Your approach to solving the problem',
        template: `# Solution Overview

## Our Solution
[High-level description of what your startup does]

## How It Works
[Step-by-step explanation of your solution]

## Key Differentiators
[What makes your solution unique compared to alternatives?]

## Technical Approach
[Core technology, methodology, or IP]

## Solution Validation
[Evidence that your solution works — prototypes, pilots, user feedback]

## Scalability
[How does the solution scale as demand grows?]
`,
      },
      {
        id: 'value',
        name: 'Value',
        description: 'Value proposition for customers and stakeholders',
        template: `# Value Proposition

## Customer Value Statement
[One-sentence value proposition: "We help [customer] achieve [outcome] by [method]"]

## Key Benefits
- **Benefit 1:** [Description]
- **Benefit 2:** [Description]
- **Benefit 3:** [Description]

## Value for Each Stakeholder
| Stakeholder | Pain Point | Value Delivered |
|-------------|------------|-----------------|
| [Customer]  |            |                 |
| [Partner]   |            |                 |
| [Investor]  |            |                 |

## Quantified Impact
[Metrics that demonstrate the value you deliver — time saved, cost reduced, revenue generated]

## Emotional vs Functional Value
[How does your solution make customers feel? What functional outcomes does it deliver?]
`,
      },
      {
        id: 'strategy',
        name: 'Strategy',
        description: 'Go-to-market and competitive strategy',
        template: `# Strategic Plan

## Vision Statement
[Where will the company be in 3-5 years?]

## Mission Statement
[Why does this company exist?]

## Strategic Objectives
1. [Objective 1] — by [Date]
2. [Objective 2] — by [Date]
3. [Objective 3] — by [Date]

## Competitive Positioning
[How do you position against competitors? Competitive moat?]

## Growth Strategy
[Describe your primary growth levers — product-led, sales-led, partnership-led, etc.]

## Key Strategic Initiatives
| Initiative | Priority | Owner | Timeline |
|------------|----------|-------|----------|
|            |          |       |          |

## Risks & Mitigations
[Key strategic risks and how you plan to address them]
`,
      },
    ],
  },
  {
    id: 'proposition',
    name: 'Proposition',
    description: 'Market, Customer & Product/Service definition',
    color: '#8B5CF6',
    subcategories: [
      {
        id: 'market',
        name: 'Market',
        description: 'Market size, trends and competitive landscape',
        template: `# Market Analysis

## Market Definition
[Define the market you are operating in]

## Market Size
- **TAM (Total Addressable Market):** $[X]B — [source]
- **SAM (Serviceable Addressable Market):** $[X]M — [rationale]
- **SOM (Serviceable Obtainable Market):** $[X]M — [year 1-3 target]

## Market Trends
[Key trends driving growth in this market]

## Market Segmentation
| Segment | Size | Growth Rate | Attractiveness |
|---------|------|-------------|----------------|
|         |      |             |                |

## Competitive Landscape
| Competitor | Strengths | Weaknesses | Market Share |
|------------|-----------|------------|--------------|
|            |           |            |              |

## Market Timing
[Why is now the right time to enter this market?]

## Regulatory Environment
[Any regulatory factors that affect the market]
`,
      },
      {
        id: 'customer',
        name: 'Customer',
        description: 'Ideal customer profile and personas',
        template: `# Customer Profile

## Ideal Customer Profile (ICP)
[Describe your ideal customer in detail — firmographics, demographics, behaviors]

## Customer Persona 1: [Name]
- **Role/Title:**
- **Demographics:**
- **Goals:**
- **Pain Points:**
- **Buying Triggers:**
- **Objections:**

## Customer Persona 2: [Name]
- **Role/Title:**
- **Demographics:**
- **Goals:**
- **Pain Points:**
- **Buying Triggers:**
- **Objections:**

## Customer Journey Map
| Stage | Awareness | Consideration | Decision | Retention |
|-------|-----------|---------------|----------|-----------|
| Actions |          |               |          |           |
| Touchpoints |      |               |          |           |

## Customer Acquisition Channels
[How do you reach your customers?]

## Voice of Customer
[Direct quotes and insights from customer interviews or surveys]
`,
      },
      {
        id: 'product-service',
        name: 'Product/Service',
        description: 'Product/service features, roadmap and differentiation',
        template: `# Product/Service Overview

## Product Summary
[One paragraph description of your core product/service]

## Core Features
| Feature | Description | Value Delivered | Priority |
|---------|-------------|-----------------|----------|
|         |             |                 |          |

## Product Roadmap
### Now (Current Quarter)
- [Feature/Initiative]

### Next (Next Quarter)
- [Feature/Initiative]

### Later (6-12 months)
- [Feature/Initiative]

## Technology Stack
[Key technologies, platforms, or tools powering your product]

## Intellectual Property
[Patents, proprietary algorithms, trade secrets, data assets]

## Product-Market Fit Evidence
[Metrics or feedback that indicate PMF — retention, NPS, engagement, referrals]

## Unit Economics
- **CAC:** $[X]
- **LTV:** $[X]
- **LTV:CAC Ratio:** [X]x
`,
      },
    ],
  },
  {
    id: 'organisation',
    name: 'Organisation',
    description: 'People, Processes & Technology infrastructure',
    color: '#0EA5E9',
    subcategories: [
      {
        id: 'people',
        name: 'People',
        description: 'Team structure, skills and culture',
        template: `# Team & People

## Founding Team
| Name | Role | Background | Equity |
|------|------|------------|--------|
|      |      |            |        |

## Key Hires (Current)
[List of current team members and their roles]

## Organisational Structure
[Describe or diagram the org structure]

## Skills Assessment
| Skill Area | Current Coverage | Gap | Hiring Plan |
|------------|-----------------|-----|-------------|
|            |                 |     |             |

## Culture & Values
[Define company values and the culture you are building]

## Hiring Plan
| Role | Priority | Timeline | Salary Range |
|------|----------|----------|--------------|
|      |          |          |              |

## Advisors & Board
| Name | Role | Contribution | Equity/Fee |
|------|------|-------------|------------|
|      |      |             |            |
`,
      },
      {
        id: 'process',
        name: 'Process',
        description: 'Operational processes and workflows',
        template: `# Operational Processes

## Core Business Processes
[List the key processes that run the business]

### Process 1: [Name]
- **Purpose:**
- **Steps:**
- **Owner:**
- **Tools Used:**
- **KPIs:**

### Process 2: [Name]
- **Purpose:**
- **Steps:**
- **Owner:**
- **Tools Used:**
- **KPIs:**

## Standard Operating Procedures (SOPs)
[Link or describe key SOPs]

## Quality Assurance
[How do you ensure quality in your product/service delivery?]

## Compliance Processes
[Any regulatory or compliance processes]

## Process Improvement Plan
[How will you optimise and improve operations over time?]
`,
      },
      {
        id: 'technology',
        name: 'Technology',
        description: 'Technology stack and infrastructure',
        template: `# Technology & Infrastructure

## Technology Stack
| Layer | Technology | Purpose | Vendor/Cost |
|-------|------------|---------|-------------|
| Frontend |         |         |             |
| Backend  |         |         |             |
| Database |         |         |             |
| Cloud    |         |         |             |
| DevOps   |         |         |             |

## Architecture Overview
[Describe the high-level system architecture]

## Security & Compliance
[Security measures, data protection, compliance standards]

## Data Strategy
[How you collect, store, process, and protect data]

## Tech Debt & Technical Risks
[Known technical debt and mitigation plans]

## Scalability Plan
[How will the technology scale with growth?]

## Disaster Recovery
[Backup, recovery, and business continuity plans]
`,
      },
    ],
  },
  {
    id: 'economics',
    name: 'Economics',
    description: 'Capital, Profitability & Impact metrics',
    color: '#10B981',
    subcategories: [
      {
        id: 'capital',
        name: 'Capital',
        description: 'Funding, investment and capital structure',
        template: `# Capital & Funding

## Funding History
| Round | Date | Amount | Valuation | Lead Investor |
|-------|------|--------|-----------|---------------|
|       |      |        |           |               |

## Current Funding Round
- **Round:** [Pre-seed / Seed / Series A]
- **Target Raise:** $[X]
- **Use of Funds:**
- **Runway Created:** [X] months
- **Valuation:** $[X]M (pre/post)

## Cap Table Summary
| Shareholder | Shares | % Ownership |
|-------------|--------|-------------|
| Founder 1   |        |             |
| Founder 2   |        |             |
| Investors   |        |             |
| ESOP Pool   |        |             |

## Use of Funds
| Category | Amount | % | Purpose |
|----------|--------|---|---------|
|          |        |   |         |

## Funding Strategy
[Future funding plans — timeline, amounts, milestones to unlock each round]
`,
      },
      {
        id: 'profitability',
        name: 'Profitability',
        description: 'Revenue, expenditure and path to profitability',
        template: `# Financial Performance

## Revenue Model
[Describe how the business makes money — pricing, revenue streams]

## Revenue Streams
| Stream | Model | Price Point | % of Revenue |
|--------|-------|-------------|--------------|
|        |       |             |              |

## Financial Summary (Current Year)
- **MRR/ARR:** $[X]
- **MoM Growth Rate:** [X]%
- **Gross Margin:** [X]%
- **Burn Rate:** $[X]/month
- **Runway:** [X] months

## P&L Summary
| | Q1 | Q2 | Q3 | Q4 | FY |
|-|----|----|----|----|----|
| Revenue |    |    |    |    |    |
| COGS    |    |    |    |    |    |
| Gross Profit |  |  |   |    |    |
| OpEx    |    |    |    |    |    |
| EBITDA  |    |    |    |    |    |

## Path to Profitability
[When and how will the business reach profitability?]

## Key Financial KPIs
[Monthly/quarterly tracking of key metrics]
`,
      },
      {
        id: 'impact',
        name: 'Impact',
        description: 'Social, environmental and economic impact',
        template: `# Impact Report

## Impact Mission
[What positive change does your startup create in the world?]

## Impact Framework
[SDGs, ESG criteria, or proprietary impact framework]

## Impact Metrics
| Metric | Baseline | Current | Target (1yr) |
|--------|----------|---------|--------------|
|        |          |         |              |

## Social Impact
[How does the business positively affect people and communities?]

## Environmental Impact
[Carbon footprint, sustainability initiatives, environmental outcomes]

## Economic Impact
[Jobs created, economic value generated, community investment]

## Impact Reporting
[How do you measure and report impact? Third-party verification?]

## Impact Roadmap
[How will impact grow as the business scales?]
`,
      },
    ],
  },
  {
    id: 'milestones',
    name: 'Milestones',
    description: 'Achievements, Challenges & Targets',
    color: '#F59E0B',
    subcategories: [
      {
        id: 'achievements',
        name: 'Achievements',
        description: 'Key milestones and wins to date',
        template: `# Achievements & Milestones

## Company Timeline
| Date | Milestone | Significance |
|------|-----------|-------------|
|      |           |             |

## Product Milestones
[Key product launches, versions, or feature achievements]

## Commercial Milestones
[Revenue milestones, key customer wins, partnerships signed]

## Team Milestones
[Key hires, team growth achievements]

## Technology Milestones
[Technical achievements, IP secured, integrations built]

## Recognition & Awards
[Press coverage, awards, accelerator acceptances, industry recognition]

## Traction Summary
- **Customers:** [X]
- **Revenue:** $[X]
- **Users:** [X]
- **Partnerships:** [X]
`,
      },
      {
        id: 'challenges',
        name: 'Challenges',
        description: 'Risks, challenges and mitigation strategies',
        template: `# Risks & Challenges

## Risk Register
| Risk | Likelihood | Impact | Severity | Mitigation | Owner |
|------|-----------|--------|----------|------------|-------|
|      |           |        |          |            |       |

## Market Risks
[Competition, market timing, adoption risks]

## Technology Risks
[Technical feasibility, security, scalability risks]

## Team Risks
[Key person dependency, talent acquisition, culture risks]

## Financial Risks
[Funding, cash flow, unit economics risks]

## Regulatory & Compliance Risks
[Legal, regulatory, and compliance challenges]

## Operational Risks
[Supply chain, process, partner dependency risks]

## Current Active Challenges
[What are you actively working to resolve right now?]

## Lessons Learned
[What have you learned from past challenges?]
`,
      },
      {
        id: 'targets',
        name: 'Targets',
        description: 'Goals, OKRs and future targets',
        template: `# Targets & Goals

## Annual Objectives (OKRs)

### Objective 1: [Title]
- **KR 1:** [Key Result]
- **KR 2:** [Key Result]
- **KR 3:** [Key Result]

### Objective 2: [Title]
- **KR 1:** [Key Result]
- **KR 2:** [Key Result]

## Quarterly Targets
| Quarter | Revenue Target | Customer Target | Product Target |
|---------|----------------|-----------------|----------------|
| Q1      |                |                 |                |
| Q2      |                |                 |                |
| Q3      |                |                 |                |
| Q4      |                |                 |                |

## 18-Month Roadmap
[Key milestones over the next 18 months]

## Fundraising Targets
[Milestones required before the next funding round]

## Success Metrics
[How will you know you've achieved your targets?]
`,
      },
    ],
  },
  {
    id: 'administrative',
    name: 'Administrative',
    description: 'Index, Legal, Financial, Commercial, Technical & Archive',
    color: '#64748B',
    subcategories: [
      {
        id: 'index',
        name: 'Index',
        description: 'Data room index and navigation',
        template: `# Data Room Index

## Document Index
[Master index of all documents in this data room]

## Data Room Overview
- **Company:** [Name]
- **Last Updated:** [Date]
- **Prepared By:** [Name]
- **Version:** [X.X]

## Access Log
| Viewer | Access Date | Documents Viewed |
|--------|-------------|-----------------|
|        |             |                 |

## Outstanding Documents
[Documents that still need to be created or updated]

## Notes for Reviewers
[Any special instructions or context for people reviewing this data room]
`,
      },
      {
        id: 'legal',
        name: 'Legal',
        description: 'Legal documents, agreements and compliance',
        template: `# Legal Documents

## Company Structure
- **Legal Entity:** [Company name, type, registration number]
- **Jurisdiction:** [Country/State]
- **Incorporated:** [Date]
- **Registered Address:** [Address]

## Key Legal Documents
| Document | Date | Status | Location |
|----------|------|--------|----------|
| Articles of Incorporation |  |  |  |
| Shareholder Agreement     |  |  |  |
| Employment Agreements     |  |  |  |
| IP Assignment Agreements  |  |  |  |

## Intellectual Property
| IP Type | Description | Status | Filing Date |
|---------|-------------|--------|-------------|
|         |             |        |             |

## Regulatory Compliance
[List of applicable regulations and compliance status]

## Outstanding Legal Matters
[Any pending legal issues, disputes, or required actions]
`,
      },
      {
        id: 'financial',
        name: 'Financial',
        description: 'Financial statements and reporting',
        template: `# Financial Documents

## Financial Statements
| Document | Period | Date Prepared | Audited? |
|----------|--------|---------------|----------|
| Balance Sheet |   |               |          |
| P&L Statement |   |               |          |
| Cash Flow Statement | |           |          |

## Banking & Accounts
[Bank accounts, payment processors, financial relationships]

## Tax & Compliance
| Obligation | Jurisdiction | Due Date | Status |
|------------|-------------|----------|--------|
|            |             |          |        |

## Financial Controls
[Description of financial controls and approval authorities]

## Audit History
[History of audits, reviews, and their findings]

## Insurance
| Policy | Provider | Coverage | Renewal Date |
|--------|----------|----------|--------------|
|        |          |          |              |
`,
      },
      {
        id: 'commercial',
        name: 'Commercial',
        description: 'Contracts, partnerships and commercial agreements',
        template: `# Commercial Agreements

## Customer Contracts
| Customer | Contract Value | Start Date | End Date | Status |
|----------|---------------|------------|----------|--------|
|          |               |            |          |        |

## Supplier & Vendor Agreements
| Vendor | Service | Contract Value | Renewal Date |
|--------|---------|---------------|--------------|
|        |         |               |              |

## Partnership Agreements
| Partner | Type | Terms | Status |
|---------|------|-------|--------|
|         |      |       |        |

## SaaS / Software Licences
| Software | Vendor | Seats | Annual Cost | Renewal |
|----------|--------|-------|-------------|---------|
|          |        |       |             |         |

## Terms & Conditions
[Links to or description of T&Cs, privacy policy, acceptable use policy]

## Commercial Pipeline
[Key prospects or partnerships in negotiation]
`,
      },
      {
        id: 'technical',
        name: 'Technical',
        description: 'Technical specifications and documentation',
        template: `# Technical Documentation

## System Architecture
[High-level architecture diagram description]

## API Documentation
[Links to or description of API docs]

## Database Schema
[Description of key data models and relationships]

## Security Documentation
- **Authentication:**
- **Authorisation:**
- **Encryption at rest:**
- **Encryption in transit:**
- **Vulnerability management:**

## Infrastructure
| Component | Provider | Region | SLA |
|-----------|----------|--------|-----|
|           |          |        |     |

## Development Practices
[Branching strategy, CI/CD, code review process, testing standards]

## Third-Party Integrations
| Integration | Purpose | API Version | Status |
|-------------|---------|-------------|--------|
|             |         |             |        |

## Technical Debt Register
| Item | Impact | Effort | Priority |
|------|--------|--------|----------|
|      |        |        |          |
`,
      },
      {
        id: 'archive',
        name: 'Archive',
        description: 'Archived documents and historical records',
        template: `# Archive

## Archived Documents
| Document | Original Location | Archived Date | Reason |
|----------|------------------|---------------|--------|
|          |                  |               |        |

## Historical Records
[Maintain a log of significant historical documents and decisions]

## Version History
[Track superseded versions of key documents]

## Notes
[Any context or notes about archived materials]
`,
      },
    ],
  },
];

export function getCategoryById(id: string): PoemCategory | undefined {
  return POEM_FRAMEWORK.find((cat) => cat.id === id);
}

export function getSubcategoryById(
  categoryId: string,
  subcategoryId: string
) {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find((sub) => sub.id === subcategoryId);
}

export function getAllSubcategoryIds(): string[] {
  return POEM_FRAMEWORK.flatMap((cat) =>
    cat.subcategories.map((sub) => sub.id)
  );
}
