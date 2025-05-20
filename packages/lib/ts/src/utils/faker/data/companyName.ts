// Common prefixes found in company names
const COMPANY_NAME_PREFIXES = [
  "Nova",
  "Meta",
  "Eco",
  "Tech",
  "Cyber",
  "Data",
  "Cloud",
  "Smart",
  "Global",
  "Digi",
  "Quantum",
  "Omni",
  "Hyper",
  "Micro",
  "Macro",
  "Nexus",
  "Fusion",
  "Synergy",
  "Vertex",
  "Peak",
  "Alpha",
  "Beta",
  "Delta",
  "Sigma",
  "Omega",
  "Ultra",
  "Mega",
  "Super",
  "Pro",
  "Elite",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "", // Empty strings to make prefixes optional
];

// Core names inspired by real companies
const COMPANY_CORE_NAMES = [
  "Apple",
  "Asana",
  "Notion",
  "Slack",
  "Dropbox",
  "Zoom",
  "Stripe",
  "Square",
  "Shopify",
  "Canva",
  "Figma",
  "Adobe",
  "Microsoft",
  "Google",
  "Amazon",
  "Tesla",
  "Uber",
  "Lyft",
  "Twitter",
  "Facebook",
  "LinkedIn",
  "Spotify",
  "Netflix",
  "Airbnb",
  "Salesforce",
  "HubSpot",
  "Zendesk",
  "Atlassian",
  "Twilio",
  "Airtable",
  "Box",
  "Trello",
  "Monday",
  "Basecamp",
  "Evernote",
  "Wix",
  "Squarespace",
  "DocuSign",
  "Okta",
  "Snowflake",
  "Palantir",
  "Plaid",
  "Coinbase",
  "Robinhood",
  "Instacart",
  "DoorDash",
  "Grubhub",
  "Postmates",
  "Etsy",
  "Pinterest",
  "Wave",
  "Pulse",
  "Spark",
  "Forge",
  "Craft",
  "Ware",
  "Byte",
  "Code",
  "Logic",
  "Metric",
  "Scale",
  "Shift",
  "Boost",
  "Dash",
  "Flow",
  "Link",
  "Loop",
  "Mind",
  "Path",
  "Quest",
  "Reach",
  "Sense",
  "Space",
  "Sphere",
  "Stack",
  "Stream",
  "Sync",
  "Track",
  "Vision",
  "Wise",
];

// Suffixes and extensions for company names
const COMPANY_NAME_SUFFIXES = [
  "Inc",
  "Corp",
  "Labs",
  "Tech",
  "Systems",
  "Networks",
  "Solutions",
  "Group",
  "Partners",
  "Ventures",
  "AI",
  "IO",
  "HQ",
  "App",
  "Software",
  "Media",
  "Digital",
  "Analytics",
  "Health",
  "Finance",
  "Pay",
  "Works",
  "Studio",
  "Design",
  "Connect",
  "Mobile",
  "Cloud",
  "Data",
  "Security",
  "Energy",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "", // Empty strings to make suffixes optional
];

// Industry-specific terms that can be added to names
const COMPANY_NAME_INDUSTRY_TERMS = [
  "Health",
  "Med",
  "Fin",
  "Bank",
  "Ed",
  "Learn",
  "Food",
  "Eat",
  "Travel",
  "Trip",
  "Home",
  "House",
  "Auto",
  "Car",
  "Shop",
  "Store",
  "Game",
  "Play",
  "Sport",
  "Fit",
  "Green",
  "Eco",
  "Clean",
  "Safe",
  "Fast",
  "Quick",
  "Smart",
  "Bright",
  "Clear",
  "Pure",
];

/**
 * Generates a random, realistic company name based on patterns from real companies.
 * The function combines prefixes, core names, and suffixes to create unique company names.
 *
 * @returns {string} A randomly generated company name
 */
export function generateCompanyName(): string {
  // Randomly decide whether to use an industry term (20% chance)
  const useIndustryTerm = Math.random() < 0.2;
  const useCoreName = Math.random() < 0.5;

  if (useCoreName) {
    return COMPANY_CORE_NAMES[
      Math.floor(Math.random() * COMPANY_CORE_NAMES.length)
    ];
  }

  // Select random components
  const prefix =
    COMPANY_NAME_PREFIXES[
      Math.floor(Math.random() * COMPANY_NAME_PREFIXES.length)
    ];
  const suffix =
    COMPANY_NAME_SUFFIXES[
      Math.floor(Math.random() * COMPANY_NAME_SUFFIXES.length)
    ];

  let name = "";

  // If using an industry term, potentially replace the core name or add it
  if (useIndustryTerm) {
    const industryTerm =
      COMPANY_NAME_INDUSTRY_TERMS[
        Math.floor(Math.random() * COMPANY_NAME_INDUSTRY_TERMS.length)
      ];

    name = industryTerm + name;
  }

  // Combine the components
  let companyName = "";

  if (prefix) {
    // 50% chance to add a space between prefix and core name
    companyName += prefix + (Math.random() < 0.5 ? " " : "");
  }

  companyName += name;

  if (suffix) {
    // Add a space before the suffix
    companyName += " " + suffix;
  }

  if (companyName === "") {
    return generateCompanyName();
  }

  return companyName;
}
