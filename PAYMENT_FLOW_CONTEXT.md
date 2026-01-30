# Payment Flow Context - TechSmartHire Platform

## Overview
This document provides comprehensive context about the assessment payment functionality in the TechSmartHire platform. The payment system integrates with Razorpay and supports multiple package tiers for candidate assessments.

---

## Architecture Overview

### Core Components

1. **Assessment Wrapper** (`components/assessment-details/assessment-wrapper.tsx`)
   - Main container component that manages the assessment flow
   - Handles state for current step, confirmations, payment status
   - Coordinates between different steps and payment

2. **Payment Cards** (`components/assessment-details/step-content/payment-cards.tsx`)
   - Displays available payment packages (FREE, BASIC, PREMIUM, PLATINUM)
   - Handles Razorpay integration
   - Manages package selection and purchase flow

3. **Step Content** (`components/assessment-details/step-content-wrapper.tsx`)
   - Wrapper that determines which step content to display
   - Passes payment-related props to Payment Cards

---

## Payment Flow Sequence

### 1. Initial State
```typescript
// On component mount (assessment-wrapper.tsx)
- assessmentPayment: Payment | null (from API)
- selectedPackageType: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM" | null
- purchaseHandler: Function | null (to be set by PaymentCards)
- userAssessmentId: string | null
```

### 2. User Journey

**Step A: Package Selection (Step 5 - Final Section)**
```
User views payment cards → Clicks on a package card
→ handlePackageCardClick() in payment-cards.tsx
→ Updates: localSelectedPackage, calls onPackageSelect()
→ Parent (wrapper) updates: selectedPackageType
```

**Step B: Start Assessment (Click "Start Now" or "Start Later")**
```
User clicks button → Validates all confirmations (steps 1-4)
→ Checks if payment is required (!assessmentPayment?.initial_paid)
→ If not paid and package selected:
   → Calls purchaseHandler(selectedPackageType)
   → Triggers payment flow
```

**Step C: Payment Processing**
```
handlePurchase() in payment-cards.tsx:
1. Calls initiatePurchase() API
2. If FREE package: Directly creates assessment
3. If PAID package: Opens Razorpay checkout
4. After successful payment: Calls verifyPayment() API
5. Updates state with payment details
6. Notifies parent via onUserAssessmentIdChange()
```

**Step D: Post-Payment**
```
After successful payment:
- userAssessmentId is set
- assessmentPayment is updated
- User can start assessment (opens in new tab)
- Redirects to /assessments?tab=taken
```

---

## State Management Flow

### Parent State (assessment-wrapper.tsx)
```typescript
const [assessmentPayment, setAssessmentPayment] = useState<Payment | null>(
  assessment?.payment || null
);

const [selectedPackageType, setSelectedPackageType] = useState<
  "FREE" | "BASIC" | "PREMIUM" | "PLATINUM" | null
>(assessment?.payment?.package_type || null);

const [purchaseHandler, setPurchaseHandler] = useState<
  ((packageType: string) => Promise<void>) | null
>(null);

const [userAssessmentId, setUserAssessmentId] = useState<string | null>(
  assessment?.user_assessment_id || null
);
```

### Child State (payment-cards.tsx)
```typescript
const [paymentSuccessData, setPaymentSuccessData] = useState<Payment | null>(
  payment || null
);

const [localSelectedPackage, setLocalSelectedPackage] = useState<string | null>(
  selectedPackage || payment?.package_type || null
);
```

### State Synchronization
```typescript
// payment-cards.tsx passes handler to parent
useEffect(() => {
  if (onPackagePurchaseReady) {
    onPackagePurchaseReady(handlePurchase);
  }
}, [onPackagePurchaseReady]);

// Parent stores the handler
const handlePackagePurchaseReady = (handler) => {
  setPurchaseHandler(handler);
};
```

---

## API Integration

### 1. Initiate Purchase
**Endpoint**: `POST /api/payment/initiate`
**File**: `api/payment.ts → initiatePurchase()`

```typescript
Request:
{
  assessment_id: string,
  packageType: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM"
}

Response (FREE):
{
  success: true,
  data: {
    id: string,  // user_assessment_id
    message: string
  }
}

Response (PAID):
{
  success: true,
  data: {
    razorpay_key_id: string,
    razorpay_order_id: string,
    amount: number,
    currency: "INR" | "USD",
    package_type: string,
    assessment_title: string
  }
}
```

### 2. Verify Payment
**Endpoint**: `POST /api/payment/verify`
**File**: `api/payment.ts → verifyPayment()`

```typescript
Request:
{
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}

Response:
{
  success: true,
  message: string,
  data: {
    user_assessment_id: string,
    payment: {
      initial_paid: boolean,
      initial_payment_status: "PAID",
      package_type: string,
      purchase_status: "ACTIVE" | "INACTIVE",
      purchased_at: number
    }
  }
}
```

### 3. Change Assessment Status
**Endpoint**: `POST /api/assessments/status`
**File**: `api/assessments.ts → changeAssessmentStatus()`

```typescript
Request:
{
  user_assessment_id: string,
  status: "ON_GOING" | "LATER"
}

Response:
{
  success: true,
  data: {
    invite_link: string  // Assessment link to open
  }
}
```

---

## Razorpay Integration

### Configuration
```typescript
// Razorpay Key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
// Test Mode: Uses Razorpay test credentials

const options = {
  key: orderData.razorpay_key_id,
  amount: orderData.amount,  // in paise (₹499 = 49900)
  currency: orderData.currency,  // "INR" or "USD"
  order_id: orderData.razorpay_order_id,
  name: "TechSmartHire",
  description: "Package - Assessment Title",
  prefill: {
    email: user.email,
    contact: user.phone
  },
  theme: {
    color: "#3399cc"
  },
  handler: async (response) => {
    // Payment success handler
    await verifyPayment(assessment_id, {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    });
  },
  modal: {
    ondismiss: () => {
      // User closed payment modal
    }
  }
};
```

### Promise Wrapper
The Razorpay checkout is wrapped in a Promise to enable async/await usage:

```typescript
const openRazorpayCheckout = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const options = {
      // ... options
      handler: async (response) => {
        try {
          await verifyPayment(...);
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled"))
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  });
};
```

---

## Package Types & Pricing

### Currency Detection
```typescript
// Auto-detect user's currency based on timezone/locale
const getDefaultCurrency = (): "INR" | "USD" => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone.includes("Asia/Kolkata") || timezone.includes("Asia/Calcutta")) {
    return "INR";
  }
  return "USD";  // Default for all other regions
};
```

### Pricing Structure
```typescript
const pricingMap = {
  INR: {
    BASIC: "₹499",
    PREMIUM: "₹1299",
    PLATINUM: "₹7999"
  },
  USD: {
    BASIC: "$10",
    PREMIUM: "$19",
    PLATINUM: "$99"
  }
};
```

### Package Features

**FREE Package**
- Available only if `is_free_plan_available === true`
- Direct assessment access without payment
- No additional features

**BASIC Package** (₹499 / $10)
- Unlock assessment
- Masked profile + score visibility to 100+ verified recruiters
- Custom job notifications based on assessed skill set

**PREMIUM Package** (₹1299 / $19)
- All BASIC features +
- One free retake (question set varies) - best score chosen
- Skilled Certification under TSH brand (valid 1 year)
- Personal QR Code for certification verification
- Detailed private performance analysis

**PLATINUM Package** (₹7999 / $99)
- All PREMIUM features +
- Mentorship to strengthen core skills
- Learning resources, online training, hands-on projects (6-8 week plan)
- Detailed 1:1 analysis and personalized retake guidance
- Knowledge gap identification and improvement roadmap

---

## Callback Chain

### Props Flow (Top to Bottom)
```
assessment-wrapper.tsx
  ├─ selectedPackageType (state)
  ├─ purchaseHandler (state)
  ├─ handlePackageSelect (callback)
  ├─ setPurchaseHandler (callback)
  ├─ handleUserAssessmentIdChange (callback)
  │
  └─> step-content-wrapper.tsx
      ├─ selectedPackage (prop)
      ├─ onPackageSelect (prop)
      ├─ onPackagePurchaseReady (prop)
      ├─ onUserAssessmentIdChange (prop)
      │
      └─> payment-cards.tsx
          ├─ selectedPackage (prop)
          ├─ handlePackageCardClick (local)
          ├─ handlePurchase (local)
          │
          ├─ calls onPackageSelect(packageType)
          ├─ calls onPackagePurchaseReady(handlePurchase)
          └─ calls onUserAssessmentIdChange({ id, payment })
```

### Event Flow (Bottom to Top)
```
User clicks package card (payment-cards.tsx)
  → handlePackageCardClick()
  → onPackageSelect(packageType)
  → handlePackageSelect() in wrapper
  → setSelectedPackageType(packageType)

User clicks "Start Assessment Now" (assessment-wrapper.tsx)
  → handleStartAssessmentNow()
  → Validates payment required
  → Calls purchaseHandler(selectedPackageType)
  → handlePurchase() in payment-cards.tsx
  → Opens Razorpay / Creates free assessment
  → On success: onUserAssessmentIdChange({ id, payment })
  → handleUserAssessmentIdChange() in wrapper
  → Updates: userAssessmentId, assessmentPayment
  → changeAssessmentStatus("ON_GOING")
  → Opens assessment link in new tab
```

---

## Common Issues & Solutions

### Issue 1: "Please select a package first" error
**Cause**: `selectedPackageType` is null when clicking Start
**Solution**: Ensure `onPackageSelect` callback is properly wired and updates parent state

### Issue 2: Payment modal doesn't open
**Cause**: Razorpay script not loaded or invalid key
**Solution**: Verify `window.Razorpay` exists and `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set

### Issue 3: Infinite re-render loop
**Cause**: Function references changing on every render (useCallback dependencies)
**Solution**: Avoid unstable callbacks in useCallback dependencies, use eslint-disable if needed

### Issue 4: Payment succeeds but state doesn't update
**Cause**: `onUserAssessmentIdChange` not called after verification
**Solution**: Ensure verifyPayment success handler calls the callback with correct data

### Issue 5: "Please purchase assessment" error after payment
**Cause**: State not synced between local and parent components
**Solution**: Verify `paymentSuccessData` and `assessmentPayment` are both updated

---

## Validation Rules

### Before Starting Assessment
```typescript
// All steps 1-4 must be confirmed
const unconfirmedSteps = [1, 2, 3, 4].filter(
  (stepNum) => !stepConfirmations[stepNum]
);

if (unconfirmedSteps.length > 0) {
  toast.error("Please confirm all required sections");
  return;
}

// Payment must be completed OR package must be selected
if (!assessmentPayment?.initial_paid) {
  if (!selectedPackageType) {
    toast.error("Please select a package first");
    return;
  }
  
  // Trigger payment flow
  await purchaseHandler(selectedPackageType);
}

// User assessment ID must exist
if (!userAssessmentId) {
  toast.error("User assessment ID is missing");
  return;
}
```

### Package Selection Rules
```typescript
// Cannot change package if already paid
if (currentPayment?.initial_payment_status === "PAID") {
  return;  // Ignore click
}

// FREE package only available if enabled
if (packageType === "FREE" && !is_free_plan_available) {
  // Card is disabled, cannot select
}
```

---

## TypeScript Interfaces

### Payment Type
```typescript
interface Payment {
  initial_paid: boolean;
  initial_payment_status: "PAID";
  package_type: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM";
  purchase_status: "ACTIVE" | "INACTIVE";
  purchased_at: number;  // Unix timestamp
}
```

### Assessment Type
```typescript
interface Assessment {
  id: string;
  title: string;
  user_assessment_id: string | null;
  payment: Payment | null;
  is_free_plan_available: boolean;
  candidate_status: "PENDING" | "ON_GOING" | "COMPLETED" | null;
  // ... other fields
}
```

### Callbacks
```typescript
type OnUserAssessmentIdChange = ({
  id,
  payment,
}: {
  id: string;
  payment: Payment;
}) => void;

type OnPackageSelect = (
  packageType: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM"
) => void;

type PurchaseHandler = (
  packageType: "FREE" | "BASIC" | "PREMIUM" | "PLATINUM"
) => Promise<void>;

type OnPackagePurchaseReady = (
  purchaseHandler: PurchaseHandler
) => void;
```

---

## Environment Variables Required

```bash
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx  # Public key for frontend

# API Base URL
NEXT_PUBLIC_API_BASE_URL=https://api.techsmarthire.com
```

---

## Testing Checklist

### Manual Testing Flow
1. ✅ Load assessment page without existing payment
2. ✅ Verify all 4 package cards display correctly
3. ✅ Click on BASIC package → verify selection highlight
4. ✅ Click on PREMIUM package → verify selection changes
5. ✅ Try clicking "Start Now" without confirming steps → verify error
6. ✅ Confirm all steps 1-4
7. ✅ Try clicking "Start Now" without selecting package → verify error
8. ✅ Select BASIC package
9. ✅ Click "Start Now" → verify Razorpay modal opens
10. ✅ Complete payment with test card
11. ✅ Verify success toast appears
12. ✅ Verify assessment link opens in new tab
13. ✅ Verify redirect to /assessments?tab=taken
14. ✅ Reload page → verify payment persists (not asked again)

### Razorpay Test Cards
```
Success: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date

Failure: 4000 0000 0000 0002
```

---

## Known Limitations

1. **Currency switching**: Users can change currency but backend may enforce based on account region
2. **Package downgrade**: Once a package is purchased, cannot select lower tier
3. **Refunds**: No refund flow implemented in frontend
4. **Payment retry**: If payment fails, user must re-initiate entire flow
5. **Session timeout**: Long idle time may require page refresh before payment

---

## Future Improvements

1. Add payment retry mechanism without full reload
2. Implement refund request flow
3. Add payment history view
4. Support for promotional codes/coupons
5. Add payment installment options for PLATINUM
6. Implement wallet/credit system
7. Add saved payment methods for faster checkout
8. Email receipt after successful payment
9. SMS notification for payment confirmation
10. Analytics tracking for payment funnel

---

## Related Files

### Core Components
- `components/assessment-details/assessment-wrapper.tsx` - Main wrapper
- `components/assessment-details/step-content-wrapper.tsx` - Step router
- `components/assessment-details/step-content/payment-cards.tsx` - Payment UI
- `components/assessment-details/step-content/final-section.tsx` - Step 5 content

### API Files
- `api/payment.ts` - Payment API calls
- `api/assessments.ts` - Assessment API calls
- `api/axios/index.ts` - Axios instance configuration

### Type Definitions
- `types/assessment.d.ts` - Assessment types (if exists)

---

## Debug Tips

### Enable Payment Logs
```typescript
// In payment-cards.tsx, temporarily add:
console.log("Payment state:", {
  currentPayment,
  selectedPackageType,
  userAssessmentId,
  paymentSuccessData
});
```

### Check Razorpay Script
```typescript
// In browser console:
console.log(window.Razorpay);  // Should be a function

// If undefined, check:
// 1. Network tab for script load
// 2. CSP headers blocking script
// 3. Ad blockers interfering
```

### Verify API Calls
```typescript
// In Network tab, filter by:
// - initiate-purchase
// - verify-payment
// - change-status

// Check request/response payloads match expected structure
```

---

## Contact & Support

For payment-related issues:
- Backend Team: Verify API endpoints and responses
- Frontend Team: Check state management and callback flow
- DevOps: Verify environment variables are set correctly
- Razorpay: Check dashboard for failed payments

---

**Last Updated**: January 30, 2026
**Version**: 1.0
**Maintained By**: TechSmartHire Frontend Team
