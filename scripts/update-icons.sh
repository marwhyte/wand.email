#!/bin/bash

# Create the destination directory if it doesn't exist
mkdir -p public/icons/outlined

# Copy all the outlined SVG icons from the node_modules package to the public directory
echo "Copying outlined icons to public/icons/outlined..."
cp node_modules/@material-design-icons/svg/outlined/*.svg public/icons/outlined/

# Count the number of icons copied
icon_count=$(ls -1 public/icons/outlined/*.svg | wc -l | xargs)
echo "Done! $icon_count icons copied to public/icons/outlined/" 