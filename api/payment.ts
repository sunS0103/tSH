import axios from "./axios";

type PackageType = "BASIC" | "PREMIUM" | "PLATINUM";

export const initiatePurchase = async ({
  assessment_id,
  packageType,
}: {
  assessment_id: string;
  packageType: PackageType;
}) => {
  const res = await axios.post(
    `/assessment/${assessment_id}/initiate-purchase`,
    {
      package_type: packageType,
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
