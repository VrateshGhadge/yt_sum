# General taste

- Prefers free, keyless, or no-billing solutions for AI/transcription dependencies where possible (YouTube captions via keyword-free services, free LLM tiers) over paid API keys. Confidence: 0.7
- Prefers solutions that add zero new npm dependencies (reusing already-installed SDKs pointed at alternative endpoints) over introducing new packages. Confidence: 0.7
- Values provider abstraction in AI-service code generally (env-driven model selection), BUT when committed to a single free provider (e.g., OpenRouter), prefers a lean, provider-specific implementation (plain `fetch` to that endpoint) over keeping a multi-provider switch that adds surface area. Confidence: 0.6
- Prefers keeping code in language/runtime style consistent with the project (CommonJS to match the project). Confidence: 0.6