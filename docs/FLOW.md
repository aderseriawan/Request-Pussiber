# Dashboard Flow Documentation

This document explains both technical architecture flow and operational threat-monitoring flow used by Request-Pussiber.

## 1) Architecture Flow

```mermaid
flowchart LR
  UI[Nuxt UI Tabs and Components]
  CMP[useThreatData composable]
  API1[/api/twitter route]
  API2[/api/instagram route]
  U1[utils/twitter.ts]
  U2[utils/instagram.ts]
  LIVE[X and Instagram APIs]
  DUMMY[Deterministic Dummy Data]

  UI --> CMP
  CMP --> API1
  CMP --> API2
  API1 --> U1
  API2 --> U2
  U1 --> LIVE
  U2 --> LIVE
  U1 --> DUMMY
  U2 --> DUMMY
  DUMMY --> API1
  DUMMY --> API2
  API1 --> CMP
  API2 --> CMP
  CMP --> UI
```

## 2) Runtime Decision Flow (Dummy vs Live)

```mermaid
flowchart TD
  A[Request hits server/api] --> B{NUXT_USE_DUMMY_ONLY == true?}
  B -- Yes --> C[Return dummy payload]
  B -- No --> D{Token present?}
  D -- No --> C
  D -- Yes --> E[Call external API]
  E --> F{Call success with usable data?}
  F -- Yes --> G[Normalize and return live data]
  F -- No --> H[Return dummy payload with note]
```

## 3) UI Navigation Flow

```mermaid
flowchart LR
  T[DashboardTabs] --> R[Ringkasan]
  T --> A[Agenda Demo]
  T --> TF[Twitter Feed]
  T --> IM[Instagram Monitor]
  T --> TA[Analisis Ancaman]
  T --> RE[Rekomendasi]
```

## 4) Threat Analysis Graph Interaction Flow

```mermaid
flowchart TD
  A[Load relation nodes and edges] --> B[Render SVG graph]
  B --> C{User interaction}
  C -->|Click node| D[Set selected node]
  D --> E[Update side detail panel]
  C -->|Hover node| F[Highlight connected edges]
  C -->|Drag node| G[Update node position]
  C -->|Pan canvas| H[Update translate]
  C -->|Zoom| I[Update scale]
```

## 5) Operational Monitoring Flow

```mermaid
flowchart TD
  S[Signal ingestion from feeds and trending] --> N[Normalize threat records]
  N --> X[Classify category High Medium Low]
  X --> Y[Compute sentiment and engagement]
  Y --> Z[Aggregate timeline and KPIs]
  Z --> AA[Render dashboard tabs]
  AA --> AB[Analyst reviews agenda and relation graph]
  AB --> AC[Generate recommendations]
  AC --> AD[Action by SOC or communication team]
  AD --> AE[Re-assess indicators and repeat]
```

## 6) Data Objects Used in Flow

- `ThreatRecord`: canonical mention/post record.
- `AgendaDemoItem`: event planning and escalation model.
- `RelationNode` and `RelationEdge`: actor relationship graph.
- `RecommendationItem`: action recommendations with confidence.

## 7) Validation Checklist

- Tabs render and switch correctly.
- Dummy mode provides complete payloads for all panels.
- Graph interactions work: click, drag, pan, zoom, highlight.
- Recommendation and agenda panels link back to evidence data.
