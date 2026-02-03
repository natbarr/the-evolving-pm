#!/bin/bash

# Daily resource ingest script
# Usage:
#   ./scripts/ingest.sh              # Today's file
#   ./scripts/ingest.sh yesterday    # Yesterday's file
#   ./scripts/ingest.sh /path/to.json # Specific file

set -e

SOURCE_DIR="$HOME/Documents/projects/ai_pm_learning_path/resources/json"
DEST_DIR="$(dirname "$0")/../resources/ingested"

# Ensure destination directory exists
mkdir -p "$DEST_DIR"

# Determine which file to use
if [ -z "$1" ]; then
  # No argument - use today's date
  DATE_STR=$(date +%y%m%d)
  SOURCE_FILE="$SOURCE_DIR/${DATE_STR}_resources.json"
  DEST_FILE="$DEST_DIR/${DATE_STR}_resources.json"
elif [ "$1" = "yesterday" ]; then
  # Yesterday's file
  DATE_STR=$(date -v-1d +%y%m%d)
  SOURCE_FILE="$SOURCE_DIR/${DATE_STR}_resources.json"
  DEST_FILE="$DEST_DIR/${DATE_STR}_resources.json"
elif [ -f "$1" ]; then
  # Specific file path provided
  SOURCE_FILE="$1"
  FILENAME=$(basename "$SOURCE_FILE")
  DEST_FILE="$DEST_DIR/$FILENAME"
else
  echo "Error: File not found: $1"
  echo ""
  echo "Usage:"
  echo "  ./scripts/ingest.sh              # Today's file"
  echo "  ./scripts/ingest.sh yesterday    # Yesterday's file"
  echo "  ./scripts/ingest.sh /path/to.json # Specific file"
  echo ""
  echo "Available files in $SOURCE_DIR:"
  ls -la "$SOURCE_DIR"/*.json 2>/dev/null | tail -5 || echo "  (none found)"
  exit 1
fi

if [ ! -f "$SOURCE_FILE" ]; then
  echo "Error: Source file not found: $SOURCE_FILE"
  echo ""
  echo "Available files in $SOURCE_DIR:"
  ls -la "$SOURCE_DIR"/*.json 2>/dev/null | tail -5 || echo "  (none found)"
  exit 1
fi

# Step 1: Copy file to local project
echo "Step 1: Copying file to project"
echo "  From: $SOURCE_FILE"
echo "  To:   $DEST_FILE"
cp "$SOURCE_FILE" "$DEST_FILE"
echo "  ✅ Copied"
echo ""

# Load API key from .env.local
SCRIPT_DIR="$(dirname "$0")"
API_KEY=$(grep INGEST_API_KEY "$SCRIPT_DIR/../.env.local" | cut -d '=' -f2)

if [ -z "$API_KEY" ]; then
  echo "Error: INGEST_API_KEY not found in .env.local"
  exit 1
fi

# Step 2: Preview
echo "Step 2: Preview"
RESOURCE_COUNT=$(python3 -c "import json; print(len(json.load(open('$DEST_FILE'))['resources']))")
echo "  Resources to ingest: $RESOURCE_COUNT"
echo ""

# Step 3: Ingest from local copy
echo "Step 3: Ingesting from local copy"

RESPONSE=$(curl -s -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d @"$DEST_FILE")

# Parse and display results
echo ""
echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    summary = data.get('summary', {})
    print('Results:')
    print(f\"  ✅ Inserted: {summary.get('inserted', 0)}\")
    print(f\"  🔄 Updated: {summary.get('updated', 0)}\")
    print(f\"  ❌ Errors: {summary.get('errors', 0)}\")
    if summary.get('errors', 0) > 0:
        print('')
        print('Error details:')
        for r in data.get('results', []):
            if r.get('status') == 'error':
                print(f\"  - {r.get('url')}: {r.get('error')}\")
except:
    print(sys.stdin.read())
"

echo ""
echo "Done! File archived at: $DEST_FILE"
