export interface AIAnalysisResult {
  category: string;
  confidence: number;
  relevantConditions: string[];
}

export class AIClaimAnalyzer {
  // Mock AI Analysis based on demo scenarios
  static async analyze(claimData: Record<string, any>): Promise<AIAnalysisResult> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Determine category based on claim text or data
    // For demo purposes, we infer from 'claimDescription' or default to Hospitalization
    const desc = (claimData.claimDescription || '').toLowerCase();
    
    let category = "Hospitalization";
    let confidence = 0.94;
    
    if (desc.includes("accident") || desc.includes("crash")) {
      category = "Accident";
      confidence = 0.89;
    } else if (desc.includes("surgery") || desc.includes("operation")) {
      category = "Surgery";
      confidence = 0.98;
    } else if (desc.includes("maternity") || desc.includes("birth")) {
      category = "Maternity";
      confidence = 0.99;
    }

    // Determine relevant conditions to verify
    // In a real system, the AI would map the category to policy rule requirements
    const relevantConditions = [
      "policy_active",
      "hospitalization_hours",
      "claim_amount",
      "claim_category"
    ];

    return {
      category,
      confidence,
      relevantConditions
    };
  }
}
