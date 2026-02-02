import axios from "./axios";

type PackageType = "FREE" | "BASIC" | "PREMIUM" | "PLATINUM";

export const initiatePurchase = async ({
  assessment_id,
  packageType,
  currency,
}: {
  assessment_id: string;
  packageType: PackageType;
  currency: "INR" | "USD";
}) => {
  const res = await axios.post(
    `/assessment/${assessment_id}/initiate-purchase`,
    {
      package_type: packageType,
      currency,
    }
  );

  return res.data;
};

export const verifyPayment = async (
  assessment_id: string,
  payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
) => {
  const res = await axios.post(
    `/assessment/${assessment_id}/verify-payment`,
    payload
  );

  return res.data;
};

export const initiateCreditPurchase = async ({
  packageType,
}: {
  packageType: "TIER_1" | "TIER_2" | "TIER_3";
}) => {
  const res = await axios.post(`/recruiter/credits/purchase/initiate`, {
    pack_type: packageType,
  });
  return res.data;
};

export const verifyCreditPurchase = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await axios.post(`/recruiter/credits/purchase/verify`, payload);
  return res.data;
};

export const getCreditPurchaseHistory = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const res = await axios.get(`/recruiter/credits/transactions`, {
    params: {
      page,
      pageSize,
    },
  });
  return res.data;
};

export const getCurrentPlan = async () => {
  const res = await axios.get(`/recruiter/subscription/current`);
  return res.data;
};

export const verifyPurchaseStatus = async () => {
  const res = await axios.get(`/recruiter/subscription/status`);
  return res.data;
};
