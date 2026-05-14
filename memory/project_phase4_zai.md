---
name: ZAI API key for Phase 4 AI insights
description: User is using ZhipuAI (ZAI) instead of Anthropic for AI-generated insights in Phase 4
type: project
---

User provided a ZhipuAI API key for Phase 4 AI features. Key stored in .env.local as ZAI_API_KEY.

**Why:** User prefers ZhipuAI (ZAI) over Anthropic API for the AI insight callouts in Phase 4.
**How to apply:** Use glm-4-flash model via ZhipuAI's OpenAI-compatible endpoint (https://open.bigmodel.cn/api/paas/v4/). The key format is `{id}.{secret}` used as Bearer token directly.
