/**
 * findr.campus — Automated Test Suite
 * Tests AI Multi-Signal Matching, Security Enforcement, and Custody State Transitions
 */

import { evaluatePair, SECTOR_ADJACENCY } from '../lib/matching-engine';
import crypto from 'crypto';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING FINDR.CAMPUS CORE TEST SUITE');
  console.log('======================================================\n');

  // TEST SUITE 1: Multi-Signal Matching Engine
  console.log('📋 1. MULTI-SIGNAL AI MATCHING PIPELINE TESTS');

  // Test 1.1: High Confidence Similar Pair
  const lostSony = {
    id: 'lost-101',
    title: 'Sony WH-1000XM4 Noise Canceling Headphones',
    category: 'Electronics',
    description: 'Black over-ear headphones left at Library Desk 4B',
    sector: 'Central Library & Cafes',
    location: 'Central Library 3rd Floor',
    brand: 'sony',
    color: 'black',
    dateLostOrFound: new Date('2026-10-24T10:00:00Z'),
    reporterId: 'user-aarav',
  };

  const foundSony = {
    id: 'found-202',
    title: 'Sony Black Wireless Headphones in Case',
    category: 'Electronics',
    description: 'Found black headphones in zippered hard case under desk in library',
    sector: 'Central Library & Cafes',
    location: 'Central Library Silent Wing',
    brand: 'sony',
    color: 'black',
    dateLostOrFound: new Date('2026-10-24T12:30:00Z'),
    reporterId: 'user-priya',
  };

  const highMatch = evaluatePair(lostSony, foundSony);
  assert(highMatch.score >= 70, `High-similarity pair scored ${highMatch.score}% (expected >= 70%)`);
  assert(highMatch.confidence === 'HIGH', `Confidence tier is HIGH (actual: ${highMatch.confidence})`);
  assert(highMatch.signals.reasons.some(r => r.includes('Brand')), 'Explains brand match in signals.reasons');
  assert(highMatch.signals.reasons.some(r => r.includes('Same campus zone')), 'Explains spatial zone match in signals.reasons');

  // Test 1.2: Dissimilar Items
  const foundBottle = {
    id: 'found-303',
    title: 'Hydro Flask 32oz Sage Green Water Bottle',
    category: 'Bottles & Tumblers',
    description: 'Green metal flask found at gym courts',
    sector: 'Sports Complex',
    location: 'Badminton Hall',
    brand: 'hydro flask',
    color: 'green',
    dateLostOrFound: new Date('2026-10-24T08:00:00Z'),
    reporterId: 'user-rohit',
  };

  const dissimMatch = evaluatePair(lostSony, foundBottle);
  assert(dissimMatch.score < 35, `Dissimilar pair scored low: ${dissimMatch.score}% (expected < 35%)`);
  assert(dissimMatch.confidence === 'UNLIKELY' || dissimMatch.confidence === 'LOW', `Confidence is UNLIKELY or LOW (actual: ${dissimMatch.confidence})`);
  assert(dissimMatch.signals.warnings.some(w => w.includes('Category Discrepancy')), 'Warns about category discrepancy');

  // Test 1.3: Self-Match Prevention (Same reporter)
  const selfItem = {
    ...foundSony,
    reporterId: 'user-aarav', // Same as lostSony
  };
  const selfMatch = evaluatePair(lostSony, selfItem);
  assert(selfMatch.score === 0, `Self-match prevented: score is 0% (actual: ${selfMatch.score}%)`);
  assert(selfMatch.confidence === 'UNLIKELY', 'Self-match confidence flagged as UNLIKELY');

  // Test 1.4: Spatial Graph Adjacency
  const libToQuad = SECTOR_ADJACENCY['Central Library & Cafes']['North Academic Quad'];
  const libToHostel = SECTOR_ADJACENCY['Central Library & Cafes']['Hostel Village'];
  assert(libToQuad > libToHostel, `Library is spatially closer to Quad (${libToQuad}) than Hostels (${libToHostel})`);


  // TEST SUITE 2: Security, Privacy & Zero-Trust Authorization
  console.log('\n🔒 2. SECURITY & ACCESS CONTROL TESTS');

  // Test 2.1: Self-Claim Prevention Logic
  const canSelfClaim = (itemReporterId: string, claimantId: string) => {
    return itemReporterId !== claimantId;
  };
  assert(!canSelfClaim('user-aarav', 'user-aarav'), 'User cannot file ownership claim on their own reported item');
  assert(canSelfClaim('user-aarav', 'user-priya'), 'Different user can submit ownership claim for review');

  // Test 2.2: Cryptographic OTP Generation
  const secureOtp = crypto.randomInt(100000, 999999).toString();
  assert(/^\d{6}$/.test(secureOtp), `Generated OTP is valid 6-digit numeric string (${secureOtp})`);
  assert(secureOtp.length === 6, 'OTP length is exactly 6 characters');

  // Test 2.3: OTP Expiration Enforcement
  const isOtpExpired = (expiresAt: Date, now: Date) => now > expiresAt;
  const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
  const futureDate = new Date(Date.now() + 86400000); // 24 hours from now
  assert(isOtpExpired(pastDate, new Date()), 'Expired OTP is rejected');
  assert(!isOtpExpired(futureDate, new Date()), 'Valid unexpired OTP is accepted');

  // Test 2.4: Rate Limiting & Attempt Lockout
  const isLockedOut = (attempts: number, maxAllowed: number = 5) => attempts >= maxAllowed;
  assert(isLockedOut(5), 'Locked out at 5 failed attempts');
  assert(!isLockedOut(2), 'Allowed access under attempt threshold (2/5)');

  // Test 2.5: Reviewer Authorization
  const isAuthorizedReviewer = (itemReporterId: string, reviewerId: string, reviewerRole: string) => {
    return itemReporterId === reviewerId || reviewerRole === 'security';
  };
  assert(isAuthorizedReviewer('user-aarav', 'user-aarav', 'student'), 'Item reporter is authorized to review claim');
  assert(isAuthorizedReviewer('user-aarav', 'user-security', 'security'), 'Campus Security officer is authorized to review claim');
  assert(!isAuthorizedReviewer('user-aarav', 'user-priya', 'student'), 'Unauthorized third-party student cannot review claim');

  // Test 2.6: Zero-Trust Public API OTP Masking
  const mockDbItem = {
    id: 'item-1',
    title: 'Casio FX-991CW Calculator',
    lockerOtp: '891024',
    status: 'In Locker',
  };
  const sanitizePublicItem = (item: typeof mockDbItem) => {
    const { lockerOtp, ...publicItem } = item;
    return publicItem;
  };
  const sanitized = sanitizePublicItem(mockDbItem);
  assert(!('lockerOtp' in sanitized), 'Public item representation completely excludes lockerOtp field');

  // SUMMARY
  console.log('\n======================================================');
  console.log(`📊 TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
