export interface PolicyRule {
  condition: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'contains';
  value: any;
}

export interface Policy {
  policyId: string;
  version: string;
  name: string;
  rules: PolicyRule[];
}

export class PolicyEngine {
  // Evaluates a set of rules against provided data (private or public)
  static evaluate(rules: PolicyRule[], data: Record<string, any>): { valid: boolean; failedConditions: string[] } {
    const failedConditions: string[] = [];

    for (const rule of rules) {
      const { condition, operator, value } = rule;
      const dataValue = data[condition];

      if (dataValue === undefined) {
        failedConditions.push(condition);
        continue;
      }

      let passed = false;
      switch (operator) {
        case '==': passed = dataValue === value; break;
        case '!=': passed = dataValue !== value; break;
        case '>': passed = dataValue > value; break;
        case '<': passed = dataValue < value; break;
        case '>=': passed = dataValue >= value; break;
        case '<=': passed = dataValue <= value; break;
        case 'in': passed = Array.isArray(value) && value.includes(dataValue); break;
        case 'contains': passed = typeof dataValue === 'string' && dataValue.includes(value); break;
        default: passed = false;
      }

      if (!passed) {
        failedConditions.push(condition);
      }
    }

    return {
      valid: failedConditions.length === 0,
      failedConditions
    };
  }
}

// Sample Policy Data
export const DEMO_POLICIES: Policy[] = [
  {
    policyId: "POL-001",
    name: "HealthSecure Gold",
    version: "1.0",
    rules: [
      { condition: "policy_active", operator: "==", value: true },
      { condition: "hospitalization_hours", operator: ">=", value: 24 },
      { condition: "claim_amount", operator: "<=", value: 500000 },
      { condition: "claim_category", operator: "in", value: ["Hospitalization", "Surgery", "Emergency treatment"] }
    ]
  },
  {
    policyId: "POL-002",
    name: "AcciCare Premium",
    version: "1.0",
    rules: [
      { condition: "policy_active", operator: "==", value: true },
      { condition: "hospitalization_hours", operator: ">=", value: 12 },
      { condition: "claim_amount", operator: "<=", value: 1000000 },
      { condition: "claim_category", operator: "in", value: ["Accident", "Emergency treatment", "Surgery"] }
    ]
  },
  {
    policyId: "POL-003",
    name: "Maternity Plus",
    version: "1.0",
    rules: [
      { condition: "policy_active", operator: "==", value: true },
      { condition: "hospitalization_hours", operator: ">=", value: 48 },
      { condition: "claim_amount", operator: "<=", value: 200000 },
      { condition: "age", operator: "<=", value: 45 },
      { condition: "claim_category", operator: "in", value: ["Maternity", "Hospitalization"] }
    ]
  },
  {
    policyId: "POL-004",
    name: "Senior Care Plan",
    version: "1.0",
    rules: [
      { condition: "policy_active", operator: "==", value: true },
      { condition: "hospitalization_hours", operator: ">=", value: 24 },
      { condition: "claim_amount", operator: "<=", value: 300000 },
      { condition: "age", operator: ">=", value: 60 },
      { condition: "claim_category", operator: "in", value: ["Hospitalization", "Surgery"] }
    ]
  },
  {
    policyId: "POL-005",
    name: "DayCare Procedure",
    version: "1.0",
    rules: [
      { condition: "policy_active", operator: "==", value: true },
      { condition: "hospitalization_hours", operator: "<", value: 24 },
      { condition: "claim_amount", operator: "<=", value: 100000 },
      { condition: "claim_category", operator: "in", value: ["Surgery", "Daycare", "Consultation"] }
    ]
  }
];
