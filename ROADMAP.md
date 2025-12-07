# Project Roadmap & Implementation Plan

## Phase 0: Foundation (Weeks 1-2)

### Setup & Infrastructure
- [x] **Issue #1**: Initialize Next.js Frontend
- [ ] **Issue #2**: AWS CDK Infrastructure Setup
  - Create `infra/` directory with CDK TypeScript project
  - Define API Gateway REST API
  - Define Lambda functions for API handlers
  - Configure LocalStack for local development
- [ ] **Issue #3**: Aurora Serverless v2 Setup
  - PostgreSQL-compatible database
  - VPC configuration
  - Security groups
- [ ] **Issue #4**: S3 Storage
  - Bucket for file uploads
  - CORS configuration
- [ ] **Issue #5**: Authentication (Lambda Authorizer + JWT)
- [ ] **Issue #22**: AI Gateway Lambda
  - Lambda function for AI operations
  - Integration with OpenAI/Anthropic
- [ ] **Issue #23**: Background Jobs (SQS + Fargate)
  - SQS queue for long-running AI tasks
  - Fargate task definitions
- [ ] **Issue #24**: ElastiCache Redis Setup
  - For caching and Y.js state
- [ ] **Issue #25**: Y.js Collaboration Service
  - Fargate service for Y.js WebSocket server
  - Application Load Balancer
- [ ] **Issue #26**: Database Schema Implementation
  - SQLAlchemy models
  - Alembic migrations

**Milestone**: AWS serverless infrastructure running on LocalStack locally

**Deliverables**:
- Frontend dev server running on port 3000
- LocalStack running with all AWS services emulated
- API Gateway endpoints accessible via LocalStack
- Lambda functions deployed and invocable
- PostgreSQL database with initial schema (local container)
- ElastiCache Redis operational (local container)
- S3 bucket created for uploads
- Authentication flow working (Lambda Authorizer)
- Basic health check endpoints
- AWS CDK stacks deployable to LocalStack and AWS

---

## Phase 1: Core Editor (Weeks 3-4)

### Editor Implementation
- [ ] **Issue #18**: Distraction-Free Editor (TipTap integration)
- [ ] **Issue #14**: Book Dashboard (outline view)
- [ ] **Issue #27**: Version History System
- [ ] **Issue #29**: Comment Threading System
- [ ] **Issue #30**: Project Status Tracking

**Milestone**: Users can create projects, write chapters, and organize content

**Deliverables**:
- Rich text editor with Markdown support
- Drag-and-drop outline reorganization
- Chapter versioning with diff view
- Comment threads on text selections
- Status markers (draft/review/final)

---

## Phase 2: AI Drafting Engine (Weeks 5-7)

### AI-Powered Writing
- [ ] **Issue #6**: Structured Chapter/Section Generator
- [ ] **Issue #7**: Fact-Driven Paragraph Generator
- [ ] **Issue #8**: Rewrite & Transform Tools
- [ ] **Issue #9**: Voice & Style Controls
- [ ] **Issue #17**: AI Ghostwriter Mode (Assist + Ghost)

**Milestone**: AI can generate and transform content based on user input

**Deliverables**:
- Chapter outline generation from topic
- Bullet point expansion to paragraphs
- 7+ rewrite operations (clarify, condense, etc.)
- Style presets + custom voice upload
- Assist mode (next paragraph suggestions)
- Ghost mode (full draft generation)

---

## Phase 3: Research Tools (Weeks 8-9)

### Research & Citations
- [ ] **Issue #10**: Research Vault (storage system)
- [ ] **Issue #11**: PDF Summarization
- [ ] **Issue #12**: Quick Fact Panels
- [ ] **Issue #13**: Citation Builder
- [ ] **Issue #28**: Source Consistency Checker

**Milestone**: Comprehensive research and citation management

**Deliverables**:
- Research note storage with tagging
- PDF upload and AI summarization
- Inline "explain this" fact panels
- Citation suggestions (APA/MLA/Chicago)
- Claim flagging and weasel word detection

---

## Phase 4: Collaboration (Weeks 10-11)

### Multi-User Features
- [ ] **Issue #16**: Real-time Collaboration (Y.js on Fargate)
  - Deploy Y.js WebSocket server to Fargate
  - Configure ALB for WebSocket connections
  - Integrate ElastiCache Redis for Y.js state persistence
- [ ] **Issue #15**: Cross-Chapter Consistency Assistant

**Milestone**: Multiple authors can work simultaneously

**Deliverables**:
- Real-time text synchronization via Y.js
- Presence indicators and cursors
- Conflict-free concurrent editing (CRDTs)
- Y.js state persisted to ElastiCache Redis
- Consistency checking across chapters
- Term tracking and contradiction detection

---

## Phase 5: Export & Polish (Weeks 12-13)

### Export & Quality
- [ ] **Issue #19**: "Ask the Book" Query (semantic search)
- [ ] **Issue #20**: Export Tools (Markdown, DOCX, PDF)
- [ ] **Issue #21**: AI Safety & Accuracy Controls

**Milestone**: Production-ready MVP with export capabilities

**Deliverables**:
- Full-book semantic search
- Clean exports (Markdown, DOCX, PDF)
- Uncertainty tagging on AI content
- Fact-lock for verified statements
- Export preserves formatting and citations

---

## Phase 6: Security & Performance (Weeks 14-15)

### Hardening
- [ ] **Issue #31**: Rate Limiting Implementation
- [ ] **Issue #32**: Audit Logging System
- [ ] **Issue #33**: Encryption at Rest for Uploads

**Milestone**: Production-ready security and observability

**Deliverables**:
- Per-user rate limiting (API + AI)
- Comprehensive audit logs
- Encrypted file storage
- Performance monitoring
- Error tracking and alerting

---

## Phase 7: Beta Testing & Refinement (Weeks 16-18)

### Testing & Feedback
- [ ] End-to-end testing suite
- [ ] Load testing and optimization
- [ ] User acceptance testing
- [ ] Bug fixes and polish
- [ ] Documentation completion

**Milestone**: MVP ready for beta users

---

## Technical Priorities

### Critical Path
1. ✅ Monorepo setup
2. Editor + Dashboard (Phase 1)
3. AI Gateway + Drafting (Phase 2)
4. Research Tools (Phase 3)
5. Export (Phase 5)

### Can Be Parallelized
- Collaboration (Phase 4) - separate from critical path
- Security hardening (Phase 6) - can implement alongside other phases
- Background workers (Phase 0) - implement as AI features are built

---

## Resource Requirements

### Development Team
- **1 Frontend Developer**: Next.js, TipTap, Y.js
- **1 Backend Developer**: Python Lambda, SQLAlchemy, AWS CDK
- **1 Full-Stack Developer**: Cross-functional tasks
- **AI/ML Specialist**: Part-time for AI integration

### Infrastructure (AWS Serverless - Pay-per-use)

#### Local Development
- **LocalStack**: Emulates AWS services locally
- **Docker**: 4 GB RAM minimum for LocalStack + services
- **PostgreSQL**: Local container for development

#### Production (Initial - Cost-Optimized)
- **Lambda**: Pay-per-invocation (~$0.20 per million requests)
- **API Gateway**: Pay-per-request (~$3.50 per million)
- **Aurora Serverless v2**: Pay-per-ACU (~$0.12/hour when active, scales to 0)
- **ElastiCache Redis**: t3.micro (~$12/month)
- **Fargate (Y.js)**: 0.25 vCPU, 0.5 GB (~$10/month always-on)
- **S3**: Pay-per-storage (~$0.023/GB)
- **AI Credits**: $500/month for testing

**Estimated Monthly Cost (MVP)**: $50-150/month at low usage

---

## Risk Mitigation

### High Risk Items
1. **Y.js Integration Complexity**
   - Mitigation: Prototype early, use examples/templates
   - Fallback: Simpler version control without real-time sync

2. **AI Cost Overruns**
   - Mitigation: Aggressive caching, rate limiting
   - Fallback: Limit free tier usage, require payment

3. **Performance at Scale**
   - Mitigation: Load testing early, optimize hot paths
   - Fallback: Add caching layers, database read replicas

4. **PDF Parsing Quality**
   - Mitigation: Use proven libraries (PyMuPDF, pdfplumber)
   - Fallback: Manual text upload option

---

## Success Metrics (MVP)

### Technical Metrics
- ✅ All 33 issues closed
- ✅ 80%+ test coverage
- ✅ API response time <200ms (p95)
- ✅ AI operations <8s (p95)
- ✅ Zero critical security vulnerabilities

### User Metrics (Post-Launch)
- 10+ active beta users
- 50+ projects created
- 500+ chapters drafted
- 80%+ user satisfaction (surveys)
- <5% error rate in production

---

## Post-MVP Enhancements

### Features Not in MVP
- Advanced publishing tools (layout, covers)
- Marketplace for templates
- Community features
- Mobile apps
- Advanced analytics dashboard
- Custom LLM fine-tuning
- Scrivener export
- LaTeX support
- Multi-language support
- API for third-party integrations

### Infrastructure Improvements
- Multi-region deployment (replicate CDK stacks)
- CloudFront CDN for static assets
- Advanced monitoring (CloudWatch dashboards, X-Ray tracing)
- Automated backups (Aurora snapshots, S3 versioning)
- Disaster recovery (cross-region replication)
- Reserved capacity for cost savings at scale

---

## Timeline Summary

| Phase | Duration | End Date | Focus |
|-------|----------|----------|-------|
| Phase 0 | 2 weeks | Week 2 | Infrastructure |
| Phase 1 | 2 weeks | Week 4 | Editor |
| Phase 2 | 3 weeks | Week 7 | AI Drafting |
| Phase 3 | 2 weeks | Week 9 | Research |
| Phase 4 | 2 weeks | Week 11 | Collaboration |
| Phase 5 | 2 weeks | Week 13 | Export |
| Phase 6 | 2 weeks | Week 15 | Security |
| Phase 7 | 3 weeks | Week 18 | Testing |

**Total MVP Timeline**: 18 weeks (~4.5 months)

---

## Current Status

**Phase**: 0 (Foundation)
**Progress**: 5%
**Issues Completed**: 0/33
**Issues In Progress**: 0
**Next Milestone**: Basic monorepo setup

---

**Last Updated**: 2025-12-07
**Version**: 2.0 (AWS Serverless Architecture)
**Maintained By**: The Brain Development Team
