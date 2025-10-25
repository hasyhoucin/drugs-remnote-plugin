# Drug Assistant OpenFDA (RemNote Plugin)

**SDK:** 0.0.39  
**Trigger:** Type `=1=1` inside any Rem to launch the assistant.

## Features

- 🔍 Live OpenFDA search for drugs as you type the first letters after the `=1=1` trigger.
- 🧠 Summaries include pharmacologic family, actions, commercial aliases, routes, indications, and dosage guidance.
- 📋 One-click copy of a structured summary for quick insertion into your notes.
- 🧩 Powerup scaffolding for storing curated drug data in tables (leveraging the 0.0.39 `registerPowerup` object signature).

## Usage

1. Install the plugin and ensure it is enabled.
2. Place your cursor in any Rem and type `=1=1` followed immediately by the first letters of a drug (e.g., `=1=1 amoxi`).
3. A floating window opens with matched drug suggestions pulled from the OpenFDA Label endpoint.
4. Use the **Copy Summary** button to copy the highlighted drug data to your clipboard.

## Development

```bash
npm install
npm run start