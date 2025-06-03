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

1. Create a file named `.env` in your home directory:
   - Mac: `~/.env`
   - Windows: `C:\Users\YourUsername\.env`

2. Open the file with TextEdit (Mac) or Notepad (Windows)

3. Add one or more of these lines:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Save the file and start StoryGrinder

#### Getting API Keys:

**Google Gemini (Inexpensive)**
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Click "Create API Key"
- Copy the key

**Anthropic Claude**
- Create account at [Anthropic Console](https://console.anthropic.com/)
- Navigate to API Keys section
- Create new API key

**OpenAI**
- Sign up at [OpenAI Platform](https://platform.openai.com/)
- Go to API Keys in your account
- Create new secret key

---

### Your First Project

> Note: 
> StoryGrinder can NOT access any files outside of the directory
> /writing_with_storygrinder, so initially you will have to copy or 
> move your .docx or .txt files into a project folder 
> ... for example:
> - create a new folder named: Moby Dick
> - ~/writing_with_storygrinder/MobyDick
> - copy a .docx of .txt of your book/novel/manuscript

1. Launch StoryGrinder
2. Click "Create New Project" 
3. Give your project a name (e.g., "My Novel")
4. Add your manuscript file (`.txt` or `.docx`)
5. Select a tool from the dropdown menu
6. Click "Setup & Run"

Your projects are stored in `~/writing_with_storygrinder/` on your computer. 
Each project gets its own folder with your manuscript(s) and all 
timestamped generated analysis files.

---

## Available Tools

### Manuscript Analysis & Editing

* **Tokens & Words Counter** - Counts words and tokens in your manuscript

* **Narrative Integrity Checker** - Verifies your story stays consistent with your world-building and outline

* **Developmental Editing** - Deep structural analysis of plot, character arcs, pacing, and themes

* **Line Editing** - Detailed sentence-level improvements for specific chapters

* **Copy Editing** - Grammar, syntax, punctuation, and consistency corrections

* **Proofreader Spelling** - This is not an AI Tool, but blazing fast spell checker (watch out for false positives)

* **Proofreader Punctuation** - Finds run-on sentences, missing commas, and other punctuation issues

* **Proofreader Plot Consistency** - Specifically checks for plot holes and world-building inconsistencies

* **Manuscript to Outline/Characters/World** - Extracts structure from an existing manuscript to create planning documents

* **Plot Thread Tracker** - Maps how your various plot lines interconnect, converge, and resolve

* **Tense Consistency Checker** - Catches unintended tense shifts that could confuse readers

* **Character Analyzer** - Tracks character appearances and ensures consistency across your manuscript

* **Adjective & Adverb Optimizer** - Suggests stronger verbs and nouns to replace weak modifiers

* **Dangling Modifier Checker** - Identifies confusing or unintentionally humorous modifier placement

* **Rhythm Analyzer** - Checks sentence variety and whether your prose rhythm matches the mood

* **Crowding & Leaping Evaluator** - Analyzes pacing using Ursula K. Le Guin's concepts of dense detail vs. time jumps

* **Conflict Analyzer** - Examines conflict patterns at scene, chapter, and story arc levels

* **Foreshadowing Tracker** - Ensures your planted clues and hints have proper payoffs

* **KDP Publishing Prep** - Generates Amazon KDP metadata like descriptions, categories, and keywords

* **Drunken** - Provides brutally honest (and slightly tipsy) manuscript critique

---

### Content Generation & Organization

* **Brainstorm Tool** - Generates story ideas and creative angles based on your prompts

* **Outline Writer** - Creates a detailed plot outline from your premise or brainstorming notes

* **World Writer** - Develops comprehensive world-building documents from your outline

* **Chapter Writer** - Drafts new chapters based on your outline and existing manuscript

---

### Utility Tools

* **DOCX Comments Extractor** - Pulls out all comments from Word documents for easy review

* **EPUB to TXT Converter** - Converts ebook files to plain text for analysis

## Privacy & Security

- API keys are stored in your home directory's .env file
- You control when AI services are accessed
- No automatic uploads or background processing

## Support

Having issues or suggestions? Please visit our [GitHub Issues page](https://github.com/cleesmith/storygrinder/issues).

## About

StoryGrinder speaks directly to the writer's experience of struggling to identify issues in their own work. This app makes the painful process more manageable, and is an integral part of creating great writing. It's honest about the process without being negative—editing is about improvement, after all.