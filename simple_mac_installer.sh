#!/bin/bash

echo "Installing StoryGrinder..."

# Move the app to Applications
echo "Moving to Applications folder..."
cp -R "storygrinder.app" "/Applications/"

# Remove quarantine attributes
echo "Removing security restrictions..."
xattr -rd com.apple.quarantine "/Applications/storygrinder.app"

echo "Done! StoryGrinder is now in your Applications folder."
echo "Press Enter to close..."
read