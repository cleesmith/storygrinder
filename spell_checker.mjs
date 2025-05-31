// First install the package:
// npm install simple-spellchecker

import spellchecker from 'simple-spellchecker';
import { promises as fs } from 'fs';
import { promisify } from 'util';

const getDictionary = promisify(spellchecker.getDictionary);

async function setupSpellChecker() {
  try {
    const dictionary = await getDictionary('en-US');
    return dictionary;
  } catch (error) {
    throw new Error(`Failed to setup spell checker: ${error.message}`);
  }
}

function isLikelyValidWord(word) {
  // Skip numbers
  if (/^\d+$/.test(word)) return true;
  if (/^\d+(st|nd|rd|th)$/.test(word)) return true; // 1st, 2nd, etc.
  if (/^\d+s$/.test(word)) return true; // 1970s, 80s, etc.
  
  // Skip contractions without apostrophes (common when punctuation is stripped)
  const contractions = ['wasn', 'weren', 'doesn', 'couldn', 'wouldn', 'hadn', 'didn', 'isn', 'aren', 'hasn', 'shouldn', 'haven', 'ain'];
  if (contractions.includes(word)) return true;
  
  // Skip very short words (often abbreviations or informal)
  if (word.length <= 2) return true;
  
  // Skip common internet/modern terms
  const modernTerms = ['app', 'apps', 'gmail', 'facebook', 'googling', 'youtuber', 'bluetooth', 'offline', 'online', 'wifi', 'blog', 'selfies', 'omg', 'wtf'];
  if (modernTerms.includes(word)) return true;
  
  // Skip obvious compound words that might not be in dictionary
  if (word.includes('phone') || word.includes('top') || word.includes('view') || word.includes('stick')) {
    const compoundParts = word.split(/(?=phone|top|view|stick)/);
    if (compoundParts.length > 1) return true;
  }
  
  return false;
}

function categorizeWord(word) {
  if (/^[A-Z]/.test(word)) return 'proper_noun';
  if (word.length >= 8 && word.includes('ing')) return 'long_word';
  if (/[aeiou]{3,}/.test(word)) return 'unusual_spelling';
  return 'general';
}

async function checkTextFile(filePath) {
  try {
    const dictionary = await setupSpellChecker();
    
    // Read the text file
    const fileContent = await fs.readFile(filePath, 'utf8');
    console.log(`Checking file: ${filePath}\n`);
    
    // Split into words (remove punctuation and convert to lowercase)
    const allWords = fileContent
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')  // Keep apostrophes for contractions
      .split(/\s+/)              // Split on whitespace
      .filter(word => word.length > 1);  // Remove single characters and empty strings
    
    const uniqueWords = [...new Set(allWords)]; // Remove duplicates for checking
    const misspelledWords = [];
    
    console.log(`File Statistics:`);
    console.log(`   Total words: ${allWords.length}`);
    console.log(`   Unique words: ${uniqueWords.length}\n`);
    
    uniqueWords.forEach(word => {
      // Clean up any remaining punctuation at start/end
      const cleanWord = word.replace(/^[^\w']+|[^\w']+$/g, '');
      
      if (cleanWord.length > 2 && !isLikelyValidWord(cleanWord) && !dictionary.spellCheck(cleanWord)) {
        const suggestions = dictionary.getSuggestions(cleanWord, 3);
        misspelledWords.push({
          word: cleanWord,
          suggestions: suggestions || [],
          category: categorizeWord(cleanWord)
        });
      }
    });
    
    if (misspelledWords.length === 0) {
      console.log('No suspicious misspellings found!');
      return;
    }
    
    // Group by category
    const categories = {
      general: misspelledWords.filter(w => w.category === 'general'),
      proper_noun: misspelledWords.filter(w => w.category === 'proper_noun'),
      long_word: misspelledWords.filter(w => w.category === 'long_word'),
      unusual_spelling: misspelledWords.filter(w => w.category === 'unusual_spelling')
    };
    
    console.log(`Found ${misspelledWords.length} potentially misspelled words:\n`);
    
    // Show ALL general misspellings (most likely to be real errors)
    if (categories.general.length > 0) {
      console.log(`Likely Misspellings (${categories.general.length}):`);
      categories.general.forEach(item => {
        const suggestionText = item.suggestions.length > 0 ? 
          ` = ${item.suggestions.join(', ')}` : '';
        console.log(`   ${item.word}${suggestionText}`);
      });
      console.log('');
    }
    
    // Show ALL other categories
    if (categories.proper_noun.length > 0) {
      console.log(`Possible Proper Nouns (${categories.proper_noun.length}):`);
      categories.proper_noun.forEach(item => {
        const suggestionText = item.suggestions.length > 0 ? 
          ` = ${item.suggestions.join(', ')}` : '';
        console.log(`   ${item.word}${suggestionText}`);
      });
      console.log('');
    }
    
    if (categories.long_word.length > 0) {
      console.log(`Long/Complex Words (${categories.long_word.length}):`);
      categories.long_word.forEach(item => {
        const suggestionText = item.suggestions.length > 0 ? 
          ` = ${item.suggestions.join(', ')}` : '';
        console.log(`   ${item.word}${suggestionText}`);
      });
      console.log('');
    }
    
    if (categories.unusual_spelling.length > 0) {
      console.log(`Unusual Spellings (${categories.unusual_spelling.length}):`);
      categories.unusual_spelling.forEach(item => {
        const suggestionText = item.suggestions.length > 0 ? 
          ` = ${item.suggestions.join(', ')}` : '';
        console.log(`   ${item.word}${suggestionText}`);
      });
      console.log('');
    }
    
    const accurateCount = uniqueWords.length - misspelledWords.length;
    console.log(`Summary: ${accurateCount}/${uniqueWords.length} unique words appear to be spelled correctly`);
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`File not found: ${filePath}`);
    } else {
      console.error('Error checking text file:', error);
    }
  }
}

// Get file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node hunspell_example.mjs <path-to-text-file>');
  console.error('Example: node hunspell_example.mjs ~/writing/HattieGetsAGun/manuscript.txt');
  console.error('\nFirst install dependencies:');
  console.error('npm install simple-spellchecker');
  process.exit(1);
}

// Check the specified file
checkTextFile(filePath);