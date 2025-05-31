const fs = require('fs').promises;
const path = require('path');

// Function to read manuscript file
async function analyzeManuscriptFile(filePath) {
    try {
        const manuscriptText = await fs.readFile(filePath, 'utf8');
        
        if (!manuscriptText || manuscriptText.trim().length === 0) {
            throw new Error('The file appears to be empty or contains no readable text');
        }
        
        console.log(`Successfully loaded manuscript: ${path.basename(filePath)}`);
        console.log(`File size: ${manuscriptText.length} characters\n`);
        
        return manuscriptText;
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Error: Could not find file at path: ${filePath}`);
            console.error('Please check that the file path is correct and the file exists.');
        } else if (error.code === 'EACCES') {
            console.error(`Error: Permission denied when trying to read: ${filePath}`);
            console.error('Please check that you have read permissions for this file.');
        } else {
            console.error(`Error reading file: ${error.message}`);
        }
        throw error;
    }
}

// Smart entity extraction - find likely proper nouns
function extractSimpleEntities(text) {
    // Find all capitalized words
    const words = text.match(/\b[A-Z][a-z]+\b/g) || [];
    
    // Count frequency to identify likely proper nouns vs common words
    const wordCounts = {};
    words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    // Common words that should be filtered out (expanded list)
    const skipWords = new Set([
        'The', 'And', 'But', 'For', 'Not', 'Was', 'Were', 'Are', 'His', 'Her', 'She', 'Had', 'Has', 'Have',
        'Said', 'Say', 'Says', 'Can', 'Could', 'Would', 'Will', 'Did', 'Does', 'Don', 'Doesn', 'Won', 'Wouldn',
        'Get', 'Got', 'Give', 'Gave', 'Take', 'Took', 'Make', 'Made', 'Come', 'Came', 'Go', 'Went', 'See', 'Saw',
        'Know', 'Knew', 'Think', 'Thought', 'Want', 'Wanted', 'Need', 'Needed', 'Feel', 'Felt', 'Look', 'Looked',
        'Put', 'Call', 'Called', 'Keep', 'Kept', 'Let', 'Told', 'Tell', 'Ask', 'Asked', 'Try', 'Tried', 'Turn',
        'Turned', 'Find', 'Found', 'Leave', 'Left', 'Move', 'Moved', 'Start', 'Started', 'Stop', 'Stopped',
        'Open', 'Opened', 'Close', 'Closed', 'Help', 'Helped', 'Show', 'Showed', 'Bring', 'Brought', 'Hold',
        'Here', 'There', 'Where', 'When', 'What', 'Who', 'Why', 'How', 'This', 'That', 'These', 'Those',
        'Some', 'Many', 'Much', 'More', 'Most', 'All', 'Any', 'Each', 'Every', 'Other', 'Another', 'Same',
        'One', 'Two', 'Three', 'Four', 'Five', 'First', 'Last', 'Next', 'New', 'Old', 'Good', 'Bad', 'Big', 'Small',
        'Long', 'Short', 'High', 'Low', 'Right', 'Left', 'Fast', 'Slow', 'Hot', 'Cold', 'Hard', 'Soft', 'Full', 'Empty',
        'Yes', 'Yeah', 'Yep', 'Okay', 'Fine', 'Well', 'Just', 'Only', 'Still', 'Even', 'Also', 'Too', 'Very', 'Really',
        'Maybe', 'Perhaps', 'Probably', 'Certainly', 'Actually', 'Finally', 'Suddenly', 'Quickly', 'Slowly', 'Carefully',
        'About', 'Above', 'After', 'Again', 'Against', 'Along', 'Almost', 'Alone', 'Already', 'Always', 'Among',
        'Around', 'Away', 'Back', 'Because', 'Before', 'Behind', 'Below', 'Beside', 'Between', 'Beyond', 'Both',
        'During', 'Either', 'Enough', 'Especially', 'Exactly', 'Except', 'Far', 'From', 'Inside', 'Instead',
        'Into', 'Near', 'Never', 'Often', 'Once', 'Outside', 'Over', 'Rather', 'Since', 'Sometimes', 'Soon',
        'Then', 'Through', 'Together', 'Under', 'Until', 'Upon', 'While', 'Within', 'Without', 'Like', 'With',
        'You', 'They', 'Something', 'Now', 'Should', 'Being', 'Going', 'Getting', 'Doing', 'Looking', 'Coming',
        'Working', 'Playing', 'Running', 'Walking', 'Talking', 'Living', 'Thinking', 'Feeling', 'Seeing',
        'Hearing', 'Knowing', 'Understanding', 'Believing', 'Hoping', 'Wishing', 'Waiting', 'Watching',
        'Reading', 'Writing', 'Sitting', 'Standing', 'Lying', 'Sleeping', 'Eating', 'Drinking', 'Smiling',
        'Laughing', 'Crying', 'Crying', 'Fighting', 'Winning', 'Losing', 'Trying', 'Helping', 'Learning',
        'Teaching', 'Buying', 'Selling', 'Giving', 'Taking', 'Sending', 'Receiving', 'Opening', 'Closing',
        'Beginning', 'Ending', 'Starting', 'Stopping', 'Continuing', 'Changing', 'Staying', 'Moving', 'Traveling'
    ]);
    
    // Filter entities: must be 3+ chars, not in skip list, appear multiple times OR follow name patterns
    const entities = [...new Set(words)]
        .filter(word => word.length >= 3)
        .filter(word => !skipWords.has(word))
        .filter(word => {
            // Keep if appears multiple times (likely proper noun)
            if (wordCounts[word] > 2) return true;
            
            // Keep if follows name patterns
            const namePatterns = [
                /^[A-Z][a-z]*son$/, // Johnson, Wilson, etc.
                /^[A-Z][a-z]*ton$/, // Hamilton, Washington, etc.
                /^[A-Z][a-z]*ley$/, // Ashley, Bradley, etc.
                /^[A-Z][a-z]*sen$/, // Hansen, etc.
                /^[A-Z][a-z]*ard$/, // Richard, Leonard, etc.
                /^[A-Z][a-z]*ert$/, // Robert, Albert, etc.
                /^[A-Z][a-z]*anne$/, // Suzanne, etc.
                /^[A-Z][a-z]*beth$/, // Elizabeth, etc.
                /^[A-Z][a-z]*ford$/, // Stanford, Oxford, etc.
                /^[A-Z][a-z]*wood$/, // Redwood, Hazelwood, etc.
                /^[A-Z][a-z]*land$/, // Portland, Cleveland, etc.
                /^[A-Z][a-z]*ville$/, // Nashville, Louisville, etc.
                /^[A-Z][a-z]*burg$/, // Pittsburgh, Hamburg, etc.
                /^St\./, // St. something
                /^Mount/, // Mount something
                /^Lake/, // Lake something
            ];
            
            return namePatterns.some(pattern => pattern.test(word));
        })
        .sort();
    
    return entities;
}

// Get frequency count for entities
function getEntityFrequency(text, entities) {
    return entities.map(entity => {
        const regex = new RegExp(`\\b${entity}\\b`, 'gi');
        const matches = text.match(regex) || [];
        return {
            name: entity,
            count: matches.length
        };
    }).sort((a, b) => b.count - a.count);
}

// Core analysis function for StoryGrinder integration
function analyzeManuscriptEntities(text) {
    const entities = extractSimpleEntities(text);
    const entityFrequency = getEntityFrequency(text, entities);
    
    return {
        entities: entities,
        entityFrequency: entityFrequency,
        stats: {
            totalEntities: entities.length
        }
    };
}

// Main function
async function processManuscript() {
    const filePath = process.argv[2];
    
    if (!filePath) {
        console.error('Error: No file path provided.');
        console.error('Usage: node manuscript_entity_recognition.js <path-to-manuscript-file>');
        process.exit(1);
    }
    
    console.log(`Analyzing manuscript: ${filePath}`);
    console.log('=' .repeat(60));
    
    let manuscriptText;
    
    try {
        manuscriptText = await analyzeManuscriptFile(filePath);
    } catch (error) {
        console.error('Failed to load manuscript file. Exiting...');
        return;
    }

    // Extract entities
    console.log("=== ENTITIES FOUND ===");
    const entities = extractSimpleEntities(manuscriptText);
    console.log(`Found ${entities.length} unique entities:`);
    console.log(entities.join(', '));

    // Show top entities by frequency
    console.log("\n=== TOP ENTITIES BY FREQUENCY ===");
    const entityFrequency = getEntityFrequency(manuscriptText, entities);
    
    console.log("Most mentioned entities:");
    entityFrequency.slice(0, 20).forEach(item => {
        console.log(`  ${item.name}: ${item.count} times`);
    });

    // Summary for StoryGrinder
    console.log("\n=== SUMMARY ===");
    console.log(`Total unique entities: ${entities.length}`);
    console.log(`Most frequent: ${entityFrequency[0]?.name} (${entityFrequency[0]?.count} times)`);
}

// Run the script
processManuscript().catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
});

// Export for StoryGrinder
module.exports = {
    analyzeManuscriptFile,
    analyzeManuscriptEntities,
    extractSimpleEntities
};