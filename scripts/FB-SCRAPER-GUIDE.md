# ProFind Facebook Scraper — Workflow Guide

## Overview
Semi-automated workflow using Claude in Chrome to extract tradespeople 
from Guyana Facebook groups and save them to the ProFind database.

**You handle:** Logging into Facebook, solving CAPTCHAs, confirming saves
**Claude handles:** Navigating groups, searching, reading posts, extracting data, deduplication, saving

## How to Run

### Step 1: Start a new Claude in Chrome conversation
Open Claude side panel in Chrome and say:

```
Run the ProFind Facebook scraper. Start with [group name].
Search for: [trade] (or "all trades")
```

### Step 2: Claude will:
1. Navigate to the Facebook group
2. Use the group search to find trade posts
3. Read visible posts on screen
4. Extract: name, phone, trade, area, what they offer
5. Present findings in a table for your review
6. Save approved entries to ProFind via /api/claim

### Step 3: You review and approve
Claude shows you what it found. You say "save all" or "save 1, 3, 5" or "skip 2".

### Step 4: Repeat
Claude moves to the next search term or group.

## Target Groups (in priority order)
1. Georgetown Community Group
2. Guyana Buy & Sell  
3. East Bank Community Group
4. Guyanese Helping Guyanese
5. Guyana Services & Recommendations
6. East Coast Demerara Community
7. West Bank / West Coast Demerara Community

## Search Terms
- "electrician available"
- "plumber available"
- "welder available"  
- "carpenter available"
- "painter available"
- "AC repair" / "ac technician"
- "mechanic available"
- "mason available"
- "looking for electrician/plumber"
- "recommend a plumber/electrician"

## What Gets Extracted
- **Name**: From the post author or mentioned in the post
- **Phone**: Any 592/6xx/2xx number pattern
- **Trade**: Matched from keywords in the post
- **Area**: Matched from neighborhood mentions
- **Description**: Key services mentioned
- **Source**: "facebook_scrape" + group name

## Tips
- Best posts are from tradespeople advertising themselves ("I do electrical work, call me at...")
- Recommendation threads are gold ("Anyone know a good plumber?" → replies with names/numbers)
- Sort by "New" to get fresh listings
- Run weekly to catch new providers
