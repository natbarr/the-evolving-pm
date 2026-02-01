# Resource Assessment Process

Technical specification for the AI PM learning resource assessment system. This document serves as input for application development to automate and scale resource curation.

---

## Table of Contents

1. [Goals & Objectives](#1-goals--objectives)
2. [System Overview](#2-system-overview)
3. [Data Model](#3-data-model)
4. [New Resource Assessment](#4-new-resource-assessment)
5. [Staleness Review Process](#5-staleness-review-process)
6. [Deprecation & Archival](#6-deprecation--archival)
7. [Decision Trees](#7-decision-trees)
8. [Business Rules](#8-business-rules)
9. [Output Artifacts](#9-output-artifacts)
10. [Automation Opportunities](#10-automation-opportunities)
11. [Appendix: Enumerations](#11-appendix-enumerations)

---

## 1. Goals & Objectives

### 1.1 Primary Goals

| Goal | Description |
|------|-------------|
| **Quality Curation** | Maintain a high-quality, relevant collection of AI PM learning resources |
| **Currency** | Ensure resources remain accurate and up-to-date in a fast-evolving field |
| **Accessibility** | Prioritize free resources while tracking paid alternatives separately |
| **Discoverability** | Organize resources by category, level, and learning phase for optimal navigation |
| **Scalability** | Enable systematic review as the resource collection grows |

### 1.2 Secondary Goals

- **Deduplication**: Prevent redundant resources from entering the system
- **Transparency**: Maintain clear audit trails for all assessment decisions
- **Consistency**: Apply uniform evaluation criteria across all resources
- **Lifecycle Management**: Gracefully handle resource degradation over time

### 1.3 Success Metrics

| Metric | Target |
|--------|--------|
| Resource relevance accuracy | >90% of resources rated useful by consumers |
| Staleness detection rate | <5% of resources found outdated by users before scheduled review |
| Processing time (new resources) | Assessment completed within 48 hours of submission |
| Review schedule adherence | 100% of scheduled reviews completed on time |

---

## 2. System Overview

### 2.1 Resource Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RESOURCE LIFECYCLE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│   │ INCOMING │───▶│ EVALUATE │───▶│  ACTIVE  │───▶│ FLAGGED  │              │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│                         │               ▲              │                     │
│                         │               │              │                     │
│                         ▼               │              ▼                     │
│                   ┌──────────┐          │        ┌──────────┐               │
│                   │ REJECTED │          │        │  LEGACY  │               │
│                   └──────────┘          │        └──────────┘               │
│                                         │              │                     │
│                                    (restored)          │                     │
│                                         │              ▼                     │
│                                         │        ┌──────────┐               │
│                                         └────────│ ARCHIVED │               │
│                                                  └──────────┘               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Process Actors

| Actor | Role |
|-------|------|
| **Contributor** | Submits new resources for evaluation |
| **Assessor** | Evaluates resources against criteria |
| **Reviewer** | Conducts scheduled staleness reviews |
| **Consumer** | Uses resources for learning |

### 2.3 Key Files (Current System)

| File | Purpose |
|------|---------|
| `resources/to_review/` | Incoming resource queue |
| `resources/evaluated_resources.md` | Master tracking with metadata |
| `summarized_resources.md` | Free resource summaries (consumer-facing) |
| `paid_resources.md` | Paid resource summaries (separate track) |
| `resources.md` | Categorized free resource list (consumer-facing) |
| `learning_path.md` | Structured learning roadmap (consumer-facing) |
| `resources/archived_resources/` | Processed/archived files |
| `resources/legacy/` | Deprecated resources with notices |

---

## 3. Data Model

### 3.1 Resource Entity

```
Resource {
  // Identity
  id: UUID
  title: String (required)
  url: URL (required, unique)

  // Classification
  category: CategoryEnum (required)
  level: LevelEnum (required)
  format: FormatEnum (required)
  content_type: ContentTypeEnum (required)
  access_type: AccessTypeEnum (required)

  // Metadata
  author: String
  source: String
  publication_date: Date (YYYY-MM-DD)
  summary: Text (2-3 paragraphs)

  // Lifecycle
  status: StatusEnum (required)
  confidence: Integer (1-5)
  date_evaluated: Date
  last_verified: Date
  next_review: Date

  // Audit
  rejection_reason: String (if rejected)
  status_notes: Text[]
  review_history: ReviewEntry[]
}
```

### 3.2 Review Entry

```
ReviewEntry {
  date: Date
  reviewer: String
  previous_status: StatusEnum
  new_status: StatusEnum
  findings: String[]
  confidence_change: Integer (-2 to +2)
  notes: Text
}
```

### 3.3 Relationships

```
┌──────────────────┐         ┌──────────────────┐
│    Resource      │────────▶│    Category      │
└──────────────────┘         └──────────────────┘
         │                            │
         │                            ▼
         │                   ┌──────────────────┐
         │                   │  Learning Phase  │
         │                   └──────────────────┘
         │
         ▼
┌──────────────────┐
│  Review History  │
└──────────────────┘
```

---

## 4. New Resource Assessment

### 4.1 Process Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NEW RESOURCE ASSESSMENT FLOW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. INTAKE              2. DUPLICATE CHECK        3. CONTENT FETCH           │
│  ┌─────────────┐        ┌─────────────┐          ┌─────────────┐            │
│  │ Resource    │───────▶│ Check       │─────────▶│ Fetch URL   │            │
│  │ submitted   │        │ evaluated_  │  unique  │ content     │            │
│  │ to to_review│        │ resources   │          │             │            │
│  └─────────────┘        └─────────────┘          └─────────────┘            │
│                               │                        │                     │
│                          duplicate                     │                     │
│                               │                        │                     │
│                               ▼                        │                     │
│                         ┌─────────────┐                │                     │
│                         │ Skip & log  │                │                     │
│                         └─────────────┘                │                     │
│                                                        │                     │
│                                                        ▼                     │
│  4. RELEVANCE CHECK     5. ACCESS CHECK          6. CLASSIFICATION          │
│  ┌─────────────┐        ┌─────────────┐          ┌─────────────┐            │
│  │ Assess PM   │───────▶│ Determine   │─────────▶│ Assign:     │            │
│  │ relevance   │  yes   │ Free/Paid   │          │ - Category  │            │
│  └─────────────┘        └─────────────┘          │ - Level     │            │
│        │                                          │ - Format    │            │
│        │ not relevant                             │ - Content   │            │
│        ▼                                          │   Type      │            │
│  ┌─────────────┐                                  └─────────────┘            │
│  │ Log to      │                                        │                    │
│  │ Rejected    │                                        │                    │
│  └─────────────┘                                        ▼                    │
│                                                                              │
│  7. SUMMARIZE           8. ROUTE                 9. FINALIZE                │
│  ┌─────────────┐        ┌─────────────┐          ┌─────────────┐            │
│  │ Write 2-3   │───────▶│ Add to      │─────────▶│ Log to      │            │
│  │ paragraph   │        │ appropriate │          │ evaluated_  │            │
│  │ summary     │        │ output files│          │ resources   │            │
│  └─────────────┘        └─────────────┘          └─────────────┘            │
│                                                        │                     │
│                                                        ▼                     │
│                                                  ┌─────────────┐            │
│                                                  │ Archive     │            │
│                                                  │ source file │            │
│                                                  └─────────────┘            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Step Details

#### Step 1: Intake

- **Input**: New resource file in `resources/to_review/`
- **File Format**: `YYMMDD_resources.md` (e.g., `260125_resources.md` for Jan 25, 2026)
- **Content**: URL(s) and optional context about the resource

#### Step 2: Duplicate Check

- **Query**: Search `evaluated_resources.md` for matching URL
- **Match Criteria**: Exact URL match OR canonical URL normalization
- **If Duplicate**: Skip processing, optionally note in source file

#### Step 3: Content Fetch

- **Action**: Retrieve full content from URL
- **Capture**:
  - Page title
  - Publication date (if available)
  - Author/source
  - Full text content
  - Access restrictions (paywall, login)
- **Failure Handling**: Log as inaccessible, mark for manual review

#### Step 4: Relevance Assessment

Apply relevance criteria:

| Criterion | Requirement |
|-----------|-------------|
| Target Audience | Must be relevant to product managers |
| Topic Alignment | Must cover AI/ML product skills |
| Depth | Must provide substantive learning value |
| Technical Level | Must NOT require developer-level implementation |

**Rejection Reasons** (log verbatim):
- "Too technical for PM audience"
- "Not relevant to AI PM learning path"
- "Content inaccessible"
- "Reference library, not learning resource"
- "Duplicate of [existing resource]"

#### Step 5: Access Type Determination

```
IF full_content_requires_payment THEN
  access_type = "Paid"
ELSE IF free_trial_then_payment THEN
  access_type = "Paid"
ELSE IF partial_paywall_for_key_sections THEN
  access_type = "Paid"
ELSE
  access_type = "Free"
END IF
```

#### Step 6: Classification

**6a. Category Assignment**

| Category | Criteria |
|----------|----------|
| AI Fundamentals | Introduces core AI/ML concepts |
| AI Product Strategy | PM skills for AI products |
| Technical Skills | Hands-on prompt/context/prototyping skills |
| Business & Economics | Pricing, costs, unit economics, moats |
| Go-to-Market | Distribution, launch, growth |
| Career | Job search, roles, compensation |

**6b. Level Assignment**

Use assessment checklist from `learning_levels.md`:

| Question | Beginner | Intermediate | Expert |
|----------|----------|--------------|--------|
| Explains basic AI terms? | Yes | Briefly/No | No |
| Assumes PM experience? | Minimal | Yes | Extensive |
| Assumes AI product experience? | No | Some | Significant |
| Covers production/scale concerns? | No | Sometimes | Yes |
| Addresses cost optimization? | No | Conceptually | In depth |
| Provides frameworks? | Simple | Structured | Advanced |
| Discusses org challenges? | No | Sometimes | Yes |

**6c. Format Assignment**

| Format | Indicator |
|--------|-----------|
| Article | Single written piece, <30 min read |
| Course | Multiple sequential lessons/modules |
| Video | Standalone video content |
| Audio | Podcast or audio content |
| Book | 100+ pages written content |
| Repository | Code/templates for implementation |
| Reference | Designed for lookup, not linear reading |

**6d. Content Type Assignment**

| Content Type | Definition | Review Frequency |
|--------------|------------|------------------|
| Tool-Specific | Focused on specific tools/APIs | 3 months |
| Model-Dependent | Tied to model capabilities | 4 months |
| Pricing | Cost figures, economics | 6 months |
| Career | Job market, salaries | 6 months |
| Conceptual | Strategic frameworks | 12 months |

#### Step 7: Summary Generation

Write 2-3 paragraph summary covering:
- **Paragraph 1**: Main thesis and key frameworks introduced
- **Paragraph 2**: Specific content covered and practical takeaways
- **Paragraph 3** (if needed): Target audience and why PMs benefit

Summary requirements:
- 150-300 words
- No marketing language
- Focus on what learner gains
- Mention specific frameworks/models/tools by name

#### Step 8: Routing

| Access Type | Destination Files |
|-------------|-------------------|
| **Free** | `summarized_resources.md` + `resources.md` + consider for `learning_path.md` |
| **Paid** | `paid_resources.md` only |

**Learning Path Placement Criteria**:
- Fills a gap in existing phase
- High confidence score (4-5)
- Unique perspective not covered by existing resources

#### Step 9: Finalization

1. Add entry to `evaluated_resources.md` with full metadata
2. Calculate `next_review` date based on content type
3. Set initial `confidence` score (typically 4 for new resources)
4. Move source file to `resources/archived_resources/`
5. Create blank file for next day's resources

---

## 5. Staleness Review Process

### 5.1 Review Triggers

| Trigger Type | Condition |
|--------------|-----------|
| **Scheduled** | `next_review` date ≤ today |
| **User Report** | Consumer flags resource as outdated |
| **Event-Driven** | Major tool/model update announced |
| **Batch Review** | Periodic review of all resources by content type |

### 5.2 Review Checklist

#### 5.2.1 Accessibility Check

| Check | Pass Criteria | Failure Action |
|-------|---------------|----------------|
| URL Resolves | HTTP 200 response | Archive immediately |
| Content Accessible | No new paywall/login | If paywalled, move to Paid |
| Page Loads | Content renders correctly | Flag for investigation |

#### 5.2.2 Content Accuracy Check

| Check | Pass Criteria |
|-------|---------------|
| Models Current | AI models mentioned still exist and relevant |
| Tools Current | Tools/APIs not deprecated |
| Pricing Accurate | Cost figures within 25% of current |
| Screenshots Match | UI reflects current interfaces |
| Code Works | Code snippets use current syntax |

#### 5.2.3 Relevance Check

| Check | Pass Criteria |
|-------|---------------|
| Best Practices Align | Concepts match current industry standards |
| No Contradictions | Content doesn't conflict with authoritative sources |
| Author Active | Author still credible in the space |
| Framework Valid | Strategic frameworks not superseded |

#### 5.2.4 Quality Signals Check

| Check | Pass Criteria |
|-------|---------------|
| Recent Engagement | Activity within last 6 months |
| Author Reputation | Maintains credibility |
| Source Quality | Platform still authoritative |

### 5.3 Issue Classification

| Severity | Examples | Threshold for Action |
|----------|----------|---------------------|
| **Minor** | Slight wording, old screenshot, price <10% off | Note only |
| **Moderate** | Tool UI changes, price 10-25% off, advice suboptimal | 3+ → Flag |
| **Major** | Core advice incorrect, API deprecated, price >25% off | 1 → Flag/Legacy |

### 5.4 Review Frequency Schedule

| Content Type | Standard Review | After Flagging |
|--------------|-----------------|----------------|
| Tool-Specific | 3 months | 1 month |
| Model-Dependent | 4 months | 1 month |
| Pricing | 6 months | 2 months |
| Career | 6 months | 2 months |
| Conceptual | 12 months | 3 months |

---

## 6. Deprecation & Archival

### 6.1 Status Transition Rules

#### Active → Flagged

Trigger conditions (any):
- 2+ minor issues identified
- 1 moderate issue identified
- Author/source no longer active
- Content references deprecated tools
- Pricing >25% out of date

Actions:
1. Update `status` to "Flagged" in all files
2. Set `next_review` to 1 month (expedited)
3. Add note explaining concerns
4. Consider identifying replacement resources

#### Flagged → Active

Trigger conditions (all required):
- Issues resolved or confirmed negligible
- Content verified as accurate
- Re-review passes all checks

Actions:
1. Update `status` to "Active"
2. Reset `next_review` to standard frequency
3. Log restoration in review history

#### Flagged → Legacy

Trigger conditions (any):
- Second consecutive failed review
- 3+ moderate issues identified
- Major conceptual shifts in field
- 1 major issue identified

Actions:
1. Update `status` to "Legacy" in all files
2. Add deprecation notice in `summarized_resources.md`
3. Move detailed entry to `resources/legacy/`
4. Keep in `resources.md` with Legacy indicator
5. Log reason in review history

#### Legacy → Archived

Trigger conditions (any):
- URL becomes inaccessible
- Third consecutive failed review
- Content actively contradicts best practices
- Replaced by clearly superior resource

Actions:
1. Remove from `resources.md` and `learning_path.md`
2. Remove from `summarized_resources.md`
3. Keep historical record in `evaluated_resources.md`
4. Move files to `resources/archived_resources/`
5. Log final status in review history

#### Restoration (Legacy/Archived → Active)

Trigger conditions (all required):
- Author publishes significant update
- Content re-verified as accurate and current
- Passes full assessment criteria

Actions:
1. Re-run full assessment process
2. Update all status fields
3. Add to appropriate output files
4. Log restoration with justification

---

## 7. Decision Trees

### 7.1 New Resource Assessment Decision Tree

```
START: New resource submitted
│
├─► Is URL already in evaluated_resources.md?
│   ├─► YES → Log as duplicate, SKIP
│   └─► NO → Continue
│
├─► Can content be fetched?
│   ├─► NO → Log as inaccessible, REJECT
│   └─► YES → Continue
│
├─► Is content relevant to AI PM learning?
│   ├─► NO → Log rejection reason, REJECT
│   └─► YES → Continue
│
├─► Does content require payment for full access?
│   ├─► YES → Route to PAID track
│   └─► NO → Route to FREE track
│
├─► [Classify] Assign category, level, format, content type
│
├─► [Summarize] Write 2-3 paragraph summary
│
├─► [Route] Add to appropriate output files
│   ├─► If FREE: summarized_resources.md, resources.md, consider learning_path.md
│   └─► If PAID: paid_resources.md only
│
├─► [Log] Add to evaluated_resources.md with metadata
│
├─► [Archive] Move source file to archived_resources/
│
└─► END
```

### 7.2 Staleness Review Decision Tree

```
START: Resource due for review
│
├─► Does URL resolve (HTTP 200)?
│   ├─► NO → ARCHIVE immediately
│   └─► YES → Continue
│
├─► Is content now behind paywall?
│   ├─► YES (was FREE) → Move to PAID track
│   └─► NO → Continue
│
├─► Run accuracy checks. Count issues:
│   │
│   ├─► 0 issues → Keep ACTIVE, update last_verified
│   │
│   ├─► 1-2 minor issues → Keep ACTIVE with note
│   │
│   ├─► 3+ moderate issues OR current status is FLAGGED?
│   │   ├─► Status is FLAGGED → Move to LEGACY
│   │   └─► Status is ACTIVE → Move to FLAGGED
│   │
│   └─► 1+ major issue OR status is LEGACY?
│       ├─► Status is LEGACY → ARCHIVE
│       └─► Status is ACTIVE/FLAGGED → Move to LEGACY
│
├─► Calculate next_review date based on new status
│
├─► Update all affected files
│
├─► Log review in review history
│
└─► END
```

### 7.3 Confidence Score Adjustment

```
START: After review completion
│
├─► Were issues found?
│   ├─► NO → Confidence +1 (max 5)
│   └─► YES → Continue
│
├─► Issue severity?
│   ├─► Minor only → No change
│   ├─► 1-2 Moderate → Confidence -1
│   └─► Major OR 3+ Moderate → Confidence -2
│
├─► Is confidence now ≤ 1?
│   ├─► YES → Flag for replacement search
│   └─► NO → Continue
│
└─► END
```

---

## 8. Business Rules

### 8.1 Inclusion Rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| IR-01 | Resource must target product managers or be clearly applicable to PM work | Maintains focus |
| IR-02 | Resource must provide learning value beyond surface-level overview | Quality threshold |
| IR-03 | Technical resources must not require coding proficiency to understand concepts | Accessibility |
| IR-04 | Resource must be in English | Current scope |
| IR-05 | Resource must be publicly accessible (with or without payment) | Verifiability |

### 8.2 Exclusion Rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| ER-01 | No duplicate URLs | Deduplication |
| ER-02 | No resources requiring developer-level implementation to understand | Audience fit |
| ER-03 | No pure marketing content without substantive learning value | Quality |
| ER-04 | No paywalled resources in free resource lists | User experience |
| ER-05 | No resources with inaccessible content at time of evaluation | Verifiability |

### 8.3 Classification Rules

| Rule ID | Rule |
|---------|------|
| CR-01 | Each resource must have exactly one category assignment |
| CR-02 | Each resource must have exactly one level assignment |
| CR-03 | Each resource must have exactly one format assignment |
| CR-04 | Each resource must have exactly one content type assignment |
| CR-05 | Resources can appear in multiple learning_path.md phases if justified |

### 8.4 Status Rules

| Rule ID | Rule |
|---------|------|
| SR-01 | Only Active and Flagged resources appear in resources.md |
| SR-02 | Only Active and Flagged resources appear in learning_path.md |
| SR-03 | Legacy resources display with warning indicator |
| SR-04 | Archived resources are removed from consumer-facing files |
| SR-05 | Status changes must be logged with date and reason |

### 8.5 Review Rules

| Rule ID | Rule |
|---------|------|
| RR-01 | All resources must have a scheduled next_review date |
| RR-02 | Reviews must be completed within 7 days of scheduled date |
| RR-03 | Failed reviews trigger status change or note |
| RR-04 | Restored resources require full re-assessment |
| RR-05 | Bulk reviews group resources by content type |

---

## 9. Output Artifacts

### 9.1 Consumer-Facing Outputs

#### resources.md

**Purpose**: Categorized list of free resources for browsing

**Structure**:
```markdown
## [Category Name]

Description of category.

- [Resource Title](URL) `Status`
```

**Update Triggers**: New free resource added, status change, resource archived

#### learning_path.md

**Purpose**: Structured learning roadmap with recommended progression

**Structure**:
```markdown
## Phase N: [Phase Name]

Description of phase learning objectives.

| Resource | Focus | Status |
|----------|-------|--------|
| [Title](URL) | Focus area | `Status` |

**Outcome:** What learner achieves after phase.
```

**Update Triggers**: New high-value resource added, resource archived, major content shifts

#### summarized_resources.md

**Purpose**: Detailed summaries for free resources

**Structure**:
```markdown
## N. [Resource Title]

**URL:** [URL]

**Level:** [Level] | **Format:** [Format] | **Status:** [Status] | **Content Type:** [ContentType]

**Last Verified:** [Date]

[2-3 paragraph summary]
```

**Update Triggers**: New resource added, summary updated, status change

#### paid_resources.md

**Purpose**: Detailed summaries for paid resources (separate track)

**Structure**: Same as summarized_resources.md, plus:
```markdown
**Access:** Paid ([details])
```

### 9.2 Administrative Outputs

#### evaluated_resources.md

**Purpose**: Master tracking table with full metadata

**Structure**:
```markdown
## Active Resources

| Title | URL | Pub Date | Last Verified | Status | Next Review | Confidence | Content Type | Author/Source | Category |
|-------|-----|----------|---------------|--------|-------------|------------|--------------|---------------|----------|

## Paid Resources

[Same structure with Notes column]

## Rejected Resources

| Title | URL | Date Evaluated | Reason |
|-------|-----|----------------|--------|
```

#### resource_metadata.md

**Purpose**: Review history log and schema documentation

**Structure**:
```markdown
### [Date] - [Review Type]

**Reviewer:** [Name]
**Resources Reviewed:** [Count]
**Summary:** [Overview]

| Resource | Previous Status | New Status | Confidence | Notes |
|----------|-----------------|------------|------------|-------|
```

---

## 10. Automation Opportunities

### 10.1 High-Value Automation Candidates

| Process Step | Current State | Automation Approach | Value |
|--------------|---------------|---------------------|-------|
| **Duplicate detection** | Manual search | URL normalization + database lookup | Eliminates redundant work |
| **Content fetching** | Manual browse | Web scraping with paywall detection | Speeds intake |
| **Staleness scheduling** | Manual tracking | Automated calendar + notifications | Ensures review compliance |
| **URL health monitoring** | On-demand check | Scheduled ping + alerting | Early dead link detection |
| **Publication date extraction** | Manual inspection | Metadata parsing | Improves accuracy |

### 10.2 Medium-Value Automation Candidates

| Process Step | Current State | Automation Approach | Value |
|--------------|---------------|---------------------|-------|
| **Relevance pre-screening** | Manual review | LLM classification with confidence score | Reduces assessor workload |
| **Level suggestion** | Manual assessment | LLM analysis against criteria | Consistency |
| **Format detection** | Manual inspection | Content structure analysis | Speed |
| **Content type detection** | Manual assessment | Keyword + pattern matching | Consistency |
| **Summary generation** | Manual writing | LLM summarization with template | Speed with human review |

### 10.3 Human-in-the-Loop Requirements

| Process Step | Why Human Required |
|--------------|-------------------|
| **Final relevance decision** | Nuanced judgment about PM applicability |
| **Summary approval** | Quality control for consumer-facing content |
| **Status change decisions** | Accountability for deprecation |
| **Learning path placement** | Pedagogical judgment |
| **Confidence scoring** | Holistic assessment |

### 10.4 Suggested System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTOMATED ASSESSMENT SYSTEM                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                      │
│  │  INTAKE     │    │  PROCESSING │    │   OUTPUT    │                      │
│  │  SERVICE    │───▶│   ENGINE    │───▶│   SERVICE   │                      │
│  └─────────────┘    └─────────────┘    └─────────────┘                      │
│        │                   │                  │                              │
│        ▼                   ▼                  ▼                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                      │
│  │ - URL submit│    │ - Fetch     │    │ - Markdown  │                      │
│  │ - Bulk      │    │ - Classify  │    │   generation│                      │
│  │   import    │    │ - Summarize │    │ - Database  │                      │
│  │ - RSS feed  │    │ - Validate  │    │   sync      │                      │
│  └─────────────┘    └─────────────┘    └─────────────┘                      │
│                            │                                                 │
│                            ▼                                                 │
│                     ┌─────────────┐                                         │
│                     │   HUMAN     │                                         │
│                     │   REVIEW    │                                         │
│                     │   QUEUE     │                                         │
│                     └─────────────┘                                         │
│                            │                                                 │
│                            ▼                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                      │
│  │  SCHEDULER  │    │  MONITORING │    │  ANALYTICS  │                      │
│  │  SERVICE    │    │   SERVICE   │    │   SERVICE   │                      │
│  └─────────────┘    └─────────────┘    └─────────────┘                      │
│        │                   │                  │                              │
│        ▼                   ▼                  ▼                              │
│  - Review due    │  - URL health   │  - Resource   │                        │
│    notifications │  - Content      │    usage      │                        │
│  - Batch review  │    change       │  - Staleness  │                        │
│    scheduling    │    detection    │    patterns   │                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.5 API Design Considerations

#### Core Endpoints

```
POST   /resources              # Submit new resource
GET    /resources              # List resources (with filters)
GET    /resources/{id}         # Get resource details
PATCH  /resources/{id}         # Update resource (status, metadata)
DELETE /resources/{id}         # Archive resource

GET    /resources/{id}/reviews # Get review history
POST   /resources/{id}/reviews # Submit review

GET    /queue/intake           # Resources pending evaluation
GET    /queue/review           # Resources due for review

POST   /batch/evaluate         # Bulk intake processing
POST   /batch/review           # Bulk staleness review
```

#### Filter Parameters

```
?status=active,flagged         # Status filter
?category=technical-skills     # Category filter
?content_type=tool-specific    # Content type filter
?access_type=free              # Free vs paid filter
?review_due_before=2026-02-01  # Review schedule filter
?confidence_gte=4              # Minimum confidence
```

---

## 11. Appendix: Enumerations

### 11.1 StatusEnum

| Value | Display | Description |
|-------|---------|-------------|
| `active` | Active | Current, accurate, recommended |
| `flagged` | Flagged | Needs attention; potential staleness |
| `legacy` | Legacy | Outdated in some aspects; use with caution |
| `archived` | Archived | No longer recommended; historical only |
| `rejected` | Rejected | Did not pass initial assessment |

### 11.2 CategoryEnum

| Value | Display |
|-------|---------|
| `ai-fundamentals` | AI Fundamentals |
| `ai-product-strategy` | AI Product Strategy |
| `technical-skills` | Technical Skills |
| `business-economics` | Business & Economics |
| `go-to-market` | Go-to-Market |
| `career` | Career |

### 11.3 LevelEnum

| Value | Display | Prereqs |
|-------|---------|---------|
| `beginner` | Beginner | Basic PM knowledge, no AI experience |
| `intermediate` | Intermediate | Foundational AI knowledge, 2+ years PM |
| `expert` | Expert | Significant AI product experience |

### 11.4 FormatEnum

| Value | Display | Typical Duration |
|-------|---------|------------------|
| `article` | Article | 5-30 minutes |
| `course` | Course | Hours to weeks |
| `video` | Video | 10-60 minutes |
| `audio` | Audio | 20-90 minutes |
| `book` | Book | Days to weeks |
| `repository` | Repository | Variable |
| `reference` | Reference | Lookup-based |

### 11.5 ContentTypeEnum

| Value | Display | Review Frequency |
|-------|---------|------------------|
| `tool-specific` | Tool-Specific | 3 months |
| `model-dependent` | Model-Dependent | 4 months |
| `pricing` | Pricing | 6 months |
| `career` | Career | 6 months |
| `conceptual` | Conceptual | 12 months |

### 11.6 AccessTypeEnum

| Value | Display | Routing |
|-------|---------|---------|
| `free` | Free | summarized_resources.md, resources.md, learning_path.md |
| `paid` | Paid | paid_resources.md only |

### 11.7 ConfidenceEnum

| Value | Label | Criteria |
|-------|-------|----------|
| 5 | Essential | Foundational; highly authoritative; frequently referenced |
| 4 | Strong | High-quality; reputable; directly applicable |
| 3 | Solid | Good content; useful for most learners |
| 2 | Marginal | Useful but with gaps or emerging concerns |
| 1 | At Risk | Significant concerns; may need replacement |

---

## Document Metadata

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Created | 2026-01-24 |
| Purpose | Technical specification for app development |
| Scope | Full resource lifecycle |
| Audience | Development team |
