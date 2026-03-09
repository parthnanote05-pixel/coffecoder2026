## VISHWAAS-AI: Project Description

**VISHWAAS-AI** (Verification & Intelligence System for Holistic Analysis of Authenticity & Safety) is a multimodal forensic platform engineered to combat the escalation of AI-generated synthetic media and digital misinformation. Designed for the **Public Safety & Security** track, it provides law enforcement, media houses, and the general public with a high-precision defense against deepfakes.

--

### 1. The Core Architecture

VISHWAAS-AI operates on a **consensus-based multi-judge system**. Instead of relying on a single neural network, it passes every upload through four specialized forensic engines:

* **Engine 1: Spatial Artifact Analyzer (CNN):** Scans for pixel-level inconsistencies, GAN-specific noise patterns, and "blending" artifacts around facial boundaries and hairlines.
* **Engine 2: Temporal Consistency Monitor (LSTM/GRU):** Analyzes video frame sequences to detect unnatural blinking, irregular micro-expressions, and "fluidity" breaks that characterize diffusion-based video generation.
* **Engine 3: Bio-Signal Detector (rPPG):** Extracts subtle "pulse" signals from skin pixel variations. Synthetic faces often lack the consistent blood-flow patterns found in real human skin.
* **Engine 4: Audio-Visual Sync & Spectral Engine:** Cross-references lip movements with audio phonemes to detect lip-sync deepfakes and analyzes spectral frequencies to identify cloned or synthesized voices.

---

### 2. Key Features & Functionalities

* **Multimodal Detection:** Unified analysis for high-resolution images, video clips, and standalone audio files.
* **Explainable AI (XAI) Heatmaps:** Rather than a simple "Real/Fake" score, the system generates a **Forensic Heatmap** highlighting the specific regions of a frame that were manipulated.
* **Automated Forensic Reports:** Generates a professional, exportable PDF report detailing confidence scores, metadata integrity, and specific indicators of manipulation (e.g., "Inconsistent lighting on the jawline").
* **WhatsApp Fact-Check Integration:** A lightweight API connector designed for a WhatsApp bot, allowing users to forward suspicious media for an instant "Trust Score" to curb viral misinformation at the source.

---

### 3. Impact on Public Safety

* **Cybercrime Prevention:** Assists Cyber Cells in verifying evidence for cases involving digital impersonation or financial fraud.
* **Election Integrity:** Provides a scalable tool for monitoring and flagging "black PR" campaigns and synthetic political propaganda.
* **Protecting Identity:** Specifically designed to detect Non-Consensual Intimate Imagery (NCII) to safeguard individuals from digital harassment.

---

### 4. Technical Stack

* Frontend Stack:React 19 with TypeScript for type safety
           Vite for fast development and building
           Tailwind CSS for styling with custom design system
           Motion/React for smooth animations
           Recharts for data visualization (confidence score charts)
           React Markdown for rendering analysis findings
