/**
 * @fileoverview Application-wide constants and configuration values.
 * Centralizes magic strings, numbers, and static data to ensure consistency
 * and maintainability across the application.
 * @module constants
 */

/**
 * Navigation items displayed in the sidebar.
 * Each item maps to a route in the application.
 * @type {Array<{path: string, icon: string, label: string}>}
 */
export const NAV_ITEMS = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/ask', icon: '🤖', label: 'Ask Saarthi AI' },
  { path: '/mcc', icon: '⚖️', label: 'MCC Checker' },
  { path: '/myths', icon: '🔍', label: 'Myth Buster' },
  { path: '/evm', icon: '🗳️', label: 'EVM Simulator' },
];

/**
 * Pre-built suggestion chips shown on the AI chat page.
 * These represent commonly asked election-related questions.
 * @type {string[]}
 */
export const CHAT_SUGGESTIONS = [
  'How do I register for a Voter ID?',
  'What is NOTA and can it win?',
  'Explain EVM security features',
  'What is the Model Code of Conduct?',
  'Can NRIs vote in Indian elections?',
  'What happens on counting day?',
  'What is the cVIGIL app?',
  'Explain VVPAT and why it matters',
];

/**
 * Example MCC violation scenarios for the checker page.
 * @type {string[]}
 */
export const MCC_EXAMPLES = [
  'The Chief Minister inaugurated a new highway during the election period.',
  'A candidate distributed free sarees to voters in a village.',
  'A political party held a rally 200 meters from a polling booth on election day.',
  'The ruling party launched a new pension scheme after elections were announced.',
  "A candidate's speech asked people to vote based on their religion.",
];

/**
 * Mock candidates for the EVM simulator.
 * Uses fictional names and parties to avoid political bias.
 * @type {Array<{id: number, name: string, party: string, symbol: string}>}
 */
export const EVM_CANDIDATES = [
  { id: 1, name: 'Rahul Verma', party: 'Development Party', symbol: '🏢' },
  { id: 2, name: 'Priya Singh', party: 'Green Future', symbol: '🌱' },
  { id: 3, name: 'Amit Kumar', party: 'National Front', symbol: '⭐' },
  { id: 4, name: 'NOTA', party: 'None of the Above', symbol: '🚫' },
];

/**
 * Election myths with factual corrections for the Myth Buster page.
 * Each entry includes the myth text and a detailed truth explanation
 * citing relevant Indian laws, ECI rules, and legal precedents.
 * @type {Array<{myth: string, truth: string}>}
 */
export const ELECTION_MYTHS = [
  {
    myth: 'EVMs can be hacked remotely',
    truth:
      'EVMs are standalone machines with NO internet, Wi-Fi, or Bluetooth connectivity. They use one-time programmable (OTP) chips manufactured by Bharat Electronics Limited (BEL) and Electronics Corporation of India (ECIL). The software is burned onto the chip at the factory and CANNOT be reprogrammed. The ECI has held multiple open challenges — no one has successfully hacked an EVM under controlled conditions.',
  },
  {
    myth: 'If NOTA gets the most votes, re-election happens',
    truth:
      'This is FALSE. As per current Indian law, NOTA is merely an option to register dissent. Even if NOTA gets the highest number of votes, the candidate with the most actual votes still wins. However, in local body elections in some states (like Haryana and Maharashtra), NOTA winning does trigger a re-election. The Supreme Court has been petitioned to extend this to general elections, but no ruling has been passed yet.',
  },
  {
    myth: 'You need your Voter ID card to vote',
    truth:
      'While the EPIC (Voter ID) is the most common document, the ECI accepts 12 alternative photo identity documents including Aadhaar Card, Passport, Driving License, PAN Card, and even certain government-issued photo ID cards. Your name must, however, be on the electoral roll for your constituency.',
  },
  {
    myth: 'NRIs cannot vote in Indian elections',
    truth:
      'NRIs CAN vote! Since 2011, NRIs who have a valid Indian passport can register as overseas electors under Section 20A of the Representation of the People Act, 1950. However, they must be physically present at the polling booth in their constituency to cast their vote. The ECI has been working on e-postal ballots for NRIs, but it is not yet fully implemented.',
  },
  {
    myth: 'Exit polls can influence election results',
    truth:
      'This is why the ECI bans the publication of exit polls from the start of polling in the first phase until the last phase ends. Section 126A of the RPA prohibits exit polls during this period. Violation can result in imprisonment up to 2 years and/or a fine. Opinion polls (before voting) are allowed, but exit polls (after voting) are strictly regulated.',
  },
  {
    myth: 'The ruling party can launch welfare schemes during elections',
    truth:
      'Once the Model Code of Conduct is in effect, the ruling party (Centre or State) CANNOT announce any new projects, schemes, or grants. Section 7 of the MCC specifically prohibits the party in power from using official machinery or public exchequer for election advantage. Ministers cannot combine official visits with election work. Violating this can result in ECI action.',
  },
];

/**
 * Election statistics displayed on the homepage hero section.
 * Based on Election Commission of India data.
 * @type {Array<{value: string, label: string}>}
 */
export const ELECTION_STATS = [
  { value: '96.8 Cr', label: 'Registered Voters' },
  { value: '10.5 L', label: 'Polling Stations' },
  { value: '543', label: 'Lok Sabha Seats' },
  { value: '8', label: 'MCC Sections' },
];

/** @constant {number} VVPAT display duration in milliseconds */
export const VVPAT_DISPLAY_MS = 7000;

/** @constant {number} EVM beep frequency in Hz */
export const EVM_BEEP_FREQUENCY = 800;

/** @constant {number} EVM beep duration in milliseconds */
export const EVM_BEEP_DURATION_MS = 2000;

/** @constant {number} EVM beep volume (0.0 to 1.0) */
export const EVM_BEEP_VOLUME = 0.3;
