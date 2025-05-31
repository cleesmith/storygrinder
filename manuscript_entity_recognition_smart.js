const fs = require('fs').promises;
const path = require('path');

// Smart entity extraction using context scoring
function extractSmartEntities(text) {
    // Find all capitalized words with surrounding context
    const words = [];
    const regex = /\b[A-Z][a-z]+\b/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        const word = match[0];
        const start = Math.max(0, match.index - 50);
        const end = Math.min(text.length, match.index + word.length + 50);
        const context = text.substring(start, end).toLowerCase();
        
        words.push({ word, context, index: match.index });
    }
    
    // Count frequencies
    const frequencies = {};
    words.forEach(({ word }) => {
        frequencies[word] = (frequencies[word] || 0) + 1;
    });
    
    // Score each unique word
    const scored = {};
    words.forEach(({ word, context }) => {
        if (scored[word]) return; // Already scored
        
        scored[word] = scoreEntity(word, context, frequencies[word]);
    });
    
    // Return entities above threshold, sorted by score
    return Object.entries(scored)
        .filter(([word, score]) => score >= 3) // Threshold
        .sort((a, b) => b[1] - a[1]) // Sort by score desc
        .map(([word]) => word);
}

function scoreEntity(word, context, frequency) {
    let score = 0;
    
    // Core skip list - only the most common false positives
    const hardSkip = new Set(['The', 'And', 'But', 'His', 'Her', 'Was', 'Were', 'Had', 'Has', 'Have', 'Said', 'Did']);
    if (hardSkip.has(word)) return -999;
    
    // Frequency signals (stronger for higher frequency)
    if (frequency >= 10) score += 4;
    else if (frequency >= 5) score += 3;
    else if (frequency >= 3) score += 2;
    else score += 1;
    
    // Context signals - these are the key differentiators
    
    // Dialogue attribution (strong signal for characters)
    if (context.match(/\b(said|asked|replied|whispered|shouted|muttered|exclaimed|responded|answered)\b/)) {
        score += 4;
    }
    
    // Possessive form (strong signal for entities)
    if (context.includes(`${word.toLowerCase()}'s`) || context.includes(`${word.toLowerCase()}'`)) {
        score += 3;
    }
    
    // Titles (very strong signal for people)
    if (context.match(/\b(mr|mrs|ms|dr|prof|father|mother|aunt|uncle|brother|sister)\s+/)) {
        score += 4;
    }
    
    // Action subjects (characters do things)
    if (context.match(/\b(walked|ran|sat|stood|looked|turned|smiled|laughed|cried|nodded|shook|grabbed|held)\b/)) {
        score += 2;
    }
    
    // Location prepositions (places)
    if (context.match(/\b(in|at|to|from|near|by|beside|behind|inside|outside)\s+/)) {
        score += 2;
    }
    
    // Name patterns
    const namePatterns = [
        /^[A-Z][a-z]{2,}(son|sen|ton|ley|ard|ert|anne|beth|wood|land|ville|burg)$/,
        /^(St|Mount|Lake|Fort)\./
    ];
    if (namePatterns.some(pattern => pattern.test(word))) {
        score += 3;
    }
    
    // Penalty for likely common words that slipped through
    if (word.length <= 3 && frequency < 3) score -= 2;
    
    // Penalty for -ing words (likely verbs)
    if (word.endsWith('ing') && frequency < 5) score -= 3;
    
    return score;
}

// Get entities with their scores for debugging
function getEntityScores(text) {
    const words = [];
    const regex = /\b[A-Z][a-z]+\b/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        const word = match[0];
        const start = Math.max(0, match.index - 50);
        const end = Math.min(text.length, match.index + word.length + 50);
        const context = text.substring(start, end).toLowerCase();
        
        words.push({ word, context });
    }
    
    const frequencies = {};
    words.forEach(({ word }) => {
        frequencies[word] = (frequencies[word] || 0) + 1;
    });
    
    const scored = {};
    words.forEach(({ word, context }) => {
        if (scored[word]) return;
        scored[word] = {
            score: scoreEntity(word, context, frequencies[word]),
            frequency: frequencies[word]
        };
    });
    
    return Object.entries(scored)
        .sort((a, b) => b[1].score - a[1].score);
}

// Main processing function
async function processManuscript() {
    const filePath = process.argv[2];
    
    if (!filePath) {
        console.error('Usage: node manuscript_entity_recognition_smart.js <path-to-manuscript-file>');
        process.exit(1);
    }
    
    console.log(`Analyzing manuscript: ${filePath}`);
    console.log('=' .repeat(60));
    
    try {
        const manuscriptText = await fs.readFile(filePath, 'utf8');
        console.log(`File size: ${manuscriptText.length} characters\n`);
        
        // Extract entities
        console.log("=== SMART ENTITY EXTRACTION ===");
        const entities = extractSmartEntities(manuscriptText);
        
        console.log(`Found ${entities.length} likely entities:`);
        console.log(entities.slice(0, 50).join(', '));
        
        // Show top entities with scores for debugging
        console.log("\\n=== TOP ENTITIES WITH SCORES ===");
        const scored = getEntityScores(manuscriptText);
        scored.slice(0, 20).forEach(([word, data]) => {
            if (data.score >= 3) {
                console.log(`  ${word}: score ${data.score}, frequency ${data.frequency}`);
            }
        });
        
        console.log(`\\n=== SUMMARY ===`);
        console.log(`Total entities (score >= 3): ${entities.length}`);
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    processManuscript();
}

module.exports = { extractSmartEntities, getEntityScores };