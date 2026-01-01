// type PackageType = "BASIC" | "PREMIUM" | "PLATINUM";

import { verifyPayment } from "@/api/payment";
import { setCookie } from "cookies-next/client";

// export const initiatePurchase = async (
//   assessmentId: string,
//   packageType: PackageType,
//   token: string
// ) => {
//   const res = await fetch(
//     `http://192.168.10.227:3000/api/v1/assessment/${assessmentId}/initiate-purchase`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRhZjRjNzZkLTA1ODEtNGY1NC05MTAyLTI4MzM1ZjIwMmU5MyIsImVtYWlsIjoiY2FuZGlkYXRlLXRoc0B5b3BtYWlsLmNvbSIsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3NjcxNjI1MDAsImV4cCI6MTc2NzI0ODkwMH0._ayTH8qMw-85OQug8Tknmpm-crVGRnqEXJPpGy98UZw`,
//       },
//       body: JSON.stringify({
//         package_type: packageType,
//       }),
//     }
//   );

//   const data = await res.json();

//   console.log(data, "data");

//   if (!res.ok) {
//     throw new Error(data?.error || "Failed to initiate purchase");
//   }

//   return data.data;
// };

// export const verifyPayment = async (
//   assessmentId: string,
//   payload: {
//     razorpay_order_id: string;
//     razorpay_payment_id: string;
//     razorpay_signature: string;
//   },
//   token: string
// ) => {
//   const res = await fetch(
//     `http://192.168.10.227:3000/api/v1/assessment/${assessmentId}/verify-payment`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRhZjRjNzZkLTA1ODEtNGY1NC05MTAyLTI4MzM1ZjIwMmU5MyIsImVtYWlsIjoiY2FuZGlkYXRlLXRoc0B5b3BtYWlsLmNvbSIsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3NjcxNjI1MDAsImV4cCI6MTc2NzI0ODkwMH0._ayTH8qMw-85OQug8Tknmpm-crVGRnqEXJPpGy98UZw`,
//       },
//       body: JSON.stringify(payload),
//     }
//   );

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data?.error || "Payment verification failed");
//   }

//   return data.data;
// };

// export const openRazorpayCheckout = ({
//   orderData,
//   user,
//   assessment_id,
//   onSuccess,
// }: {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   orderData: any;
//   user: { email: string; phone?: string };
//   assessment_id: string;
//   token: string;
//   onSuccess: () => void;
// }) => {
//   const options = {
//     key: orderData.data.razorpay_key_id,
//     amount: orderData.data.amount,
//     currency: orderData.data.currency,
//     order_id: orderData.data.razorpay_order_id,
//     name: "TechSmartHire",
//     description: `${orderData.data.package_type} Package - ${orderData.data.assessment_title}`,
//     prefill: {
//       email: user.email,
//       contact: user.phone || "",
//     },
//     theme: {
//       color: "#7C3AED",
//     },
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     handler: async (response: any) => {
//       await verifyPayment(assessment_id, {
//         razorpay_order_id: response.razorpay_order_id,
//         razorpay_payment_id: response.razorpay_payment_id,
//         razorpay_signature: response.razorpay_signature,
//       });

//       onSuccess();
//     },
//     modal: {
//       ondismiss: () => {
//         console.log("Payment cancelled");
//       },
//     },
//   };

//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   const rzp = new window.Razorpay(options);
//   rzp.open();
// };
