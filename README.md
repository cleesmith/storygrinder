# StoryGrinder

StoryGrinder is a desktop application that helps fiction writers analyze and improve their manuscripts using AI-powered tools. Your manuscripts stay on your computer, and you control when and how AI assistance is applied to your work.

## Installation

### For Mac Users
1. Download the latest `.dmg` file from the [Releases page](https://github.com/cleesmith/storygrinder/releases)
2. Double-click the downloaded file
3. Drag StoryGrinder to your Applications folder
4. The first time you open it, right-click the app and choose "Open" (this is required for apps not from the App Store)

### For Windows Users  
1. Download the latest `.exe` installer from the [Releases page](https://github.com/cleesmith/storygrinder/releases)
2. Double-click the installer and follow the prompts
3. StoryGrinder will be installed and a shortcut created on your desktop

## Getting Started

### Setting Up Your API Key

StoryGrinder uses AI to analyze your manuscripts. You'll need at least one API key from these providers:

#### Option 1: Google Gemini (Inexpensive)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key
4. In StoryGrinder, go to Settings and paste your Gemini API key

#### Option 2: Anthropic Claude
1. Create an account at [Anthropic Console](https://console.anthropic.com/)
2. Navigate to API Keys section
3. Create a new API key
4. Add it in StoryGrinder's Settings

#### Option 3: OpenAI
1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Go to API Keys in your account
3. Create a new secret key
4. Enter it in StoryGrinder's Settings

### Your First Project

1. Launch StoryGrinder
2. Click "Create New Project" 
3. Give your project a name (e.g., "My Novel")
4. Add your manuscript file (`.txt` or `.docx`)
5. Select a tool from the dropdown menu
6. Click "Setup & Run"

Your projects are stored in `~/writing_with_storygrinder/` on your computer. Each project gets its own folder with your manuscript and all generated analyses.

## Available Tools

### Manuscript Analysis & Editing

* **Tokens & Words Counter** - Counts words and tokens in your manuscript

* **Narrative Integrity Checker** - Verifies your story stays consistent with your world-building and outline

* **Character Analyzer** - Tracks character appearances and ensures consistency across your manuscript

* **Plot Thread Tracker** - Maps how your various plot lines interconnect, converge, and resolve

* **Tense Consistency Checker** - Catches unintended tense shifts that could confuse readers

* **Conflict Analyzer** - Examines conflict patterns at scene, chapter, and story arc levels

* **Foreshadowing Tracker** - Ensures your planted clues and hints have proper payoffs

* **Dangling Modifier Checker** - Identifies confusing or unintentionally humorous modifier placement

* **Crowding & Leaping Evaluator** - Analyzes pacing using Ursula K. Le Guin's concepts of dense detail vs. time jumps

* **Adjective & Adverb Optimizer** - Suggests stronger verbs and nouns to replace weak modifiers

* **Rhythm Analyzer** - Checks sentence variety and whether your prose rhythm matches the mood

* **Punctuation Auditor** - Finds run-on sentences, missing commas, and other punctuation issues

* **Developmental Editing** - Deep structural analysis of plot, character arcs, pacing, and themes

* **Line Editing** - Detailed sentence-level improvements for specific chapters

* **Copy Editing** - Grammar, syntax, punctuation, and consistency corrections

* **Proofreader (Mechanical)** - Final check for spelling, grammar, and formatting errors

* **Proofreader (Plot Consistency)** - Specifically checks for plot holes and world-building inconsistencies

### Content Generation & Organization

* **Brainstorm Tool** - Generates story ideas and creative angles based on your prompts

* **Outline Writer** - Creates a detailed plot outline from your premise or brainstorming notes

* **World Writer** - Develops comprehensive world-building documents from your outline

* **Chapter Writer** - Drafts new chapters based on your outline and existing manuscript

* **Manuscript to Outline/Characters/World** - Extracts structure from an existing manuscript to create planning documents

* **KDP Publishing Prep** - Generates Amazon KDP metadata like descriptions, categories, and keywords

* **Drunk Claude** - Provides brutally honest (and slightly tipsy) manuscript critique

### Utility Tools

* **DOCX Comments Extractor** - Pulls out all comments from Word documents for easy review

* **EPUB to TXT Converter** - Converts ebook files to plain text for analysis

## Privacy & Security

- All manuscripts and project files stay on your local computer
- API keys are stored securely in your system's credential storage
- You control when AI services are accessed
- No automatic uploads or background processing

## Support

Having issues or suggestions? Please visit our [GitHub Issues page](https://github.com/yourusername/storygrinder/issues).

## About

StoryGrinder speaks directly to the writer's experience of struggling to identify issues in their own work. This app makes the painful process more manageable, and is an integral part of creating great writing. It's honest about the process without being negative—editing is about improvement, after all.