# PrivacyGuard Feedback Loop Documentation

## 1. User Acquisition & Onboarding
For the Preprod MVP, we targeted 50 real-world users who are either web3 enthusiasts or familiar with privacy-preserving technologies. We reached out to them via Discord communities, local tech meetups, and developer forums.

**Onboarding Steps:**
1. Users were provided the URL to our live Preprod Demo: [https://midnight-level4-frontend.vercel.app](https://midnight-level4-frontend.vercel.app)
2. They were instructed to test the "Submit Claim" functionality as a Claimant, simulating an insurance claim with mock data.
3. Users navigated the ZK proof generation locally on their browsers to understand the privacy-first approach.

## 2. Feedback Collection Structure
We integrated a "Feedback Form" directly into the Claimant dashboard to ensure minimal friction for users. 

**Feedback points collected:**
- **Usability:** How intuitive was the claim submission process?
- **Performance:** How fast was the ZK proof generation on their device?
- **Understanding:** Did the user understand that their data remained private?
- **Feature Requests:** What missing features would they like to see?

## 3. Key Findings
From our 50 Preprod users, we aggregated the following insights:

- **Speed:** 85% of users found the ZK proof generation faster than expected for a browser-based environment.
- **Clarity:** 40% of users wanted more visual cues during the proof generation process, as the spinner wasn't communicative enough about what was happening under the hood.
- **Trust:** 95% loved the concept of not sharing raw medical data.
- **Bugs:** 2 users reported issues with the wallet address format validation.

## 4. Prioritizing Changes (Action Items)
Based on the feedback, we prioritized the following changes for the product:
1. **High Priority (Completed):** Integrated the built-in feedback module to continue gathering insights dynamically instead of relying on external forms.
2. **Medium Priority (Planned):** Improve the loading state during ZK proof generation to explain the mathematical process happening in real-time.
3. **Low Priority (Planned):** Add tooltip explanations for what an "Auditor" and "Insurer" see.

## 5. Continuous Loop
By integrating the feedback mechanism into the core MVP loop, we ensure that as the product scales beyond 50 users, we can continually capture feature requests and bug reports synchronously.
