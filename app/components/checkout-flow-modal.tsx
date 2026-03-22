"use client";

import { useState } from "react";
import { useLogin, useSignUp } from "naystack/auth/client";
import { useToken } from "naystack/auth/client";
import { useAuthMutation } from "naystack/graphql/client";
import { CREATE_ORDER } from "@/gql/mutations";
import { INDIAN_STATES } from "@/lib/checkout/indian-states";
import Modal from "./modal";

type LineItem = {
  skuId: string;
  quantity: number;
};

type CheckoutFlowModalProps = {
  lineItems: LineItem[];
  onClose: () => void;
};

const inputClass =
  "w-full border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-2 font-[family-name:var(--font-body)] text-[var(--foreground)] outline-none focus:border-[var(--accent)]";
const labelClass =
  "mb-1 block font-[family-name:var(--font-body)] text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]";
const buttonClass =
  "w-full border-2 border-[var(--foreground)] bg-[var(--foreground)] px-6 py-3 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-white transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50";

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-6 flex gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 transition-all duration-200 ${
            i <= current
              ? "bg-[var(--foreground)]"
              : "bg-[var(--border)]"
          }`}
        />
      ))}
    </div>
  );
}

function AuthStep({
  onAuth,
  onClose,
}: {
  onAuth: () => void;
  onClose: () => void;
}) {
  const login = useLogin();
  const signUp = useSignUp();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const authError = isSignUp
        ? await signUp({ email, password, name })
        : await login({ email, password });
      if (authError) {
        setError(authError);
      } else {
        onAuth();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        <button
          onClick={onClose}
          className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          &#10005;
        </button>
      </div>
      <StepIndicator current={0} total={3} />
      <form onSubmit={handleAuth}>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {isSignUp && (
          <div className="mb-4">
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        )}
        <div className="mb-4">
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div className="mb-6">
          <label className={labelClass}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={loading} className={buttonClass}>
          {loading ? "PROCESSING..." : isSignUp ? "SIGN UP" : "LOGIN"}
        </button>
        <p className="mt-4 text-center font-[family-name:var(--font-body)] text-sm text-[var(--muted)]">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-[var(--accent)] underline"
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </>
  );
}

type ContactData = {
  name: string;
  email: string;
  phone: string;
};

function ContactStep({
  data,
  onChange,
  onNext,
  onBack,
  onClose,
}: {
  data: ContactData;
  onChange: (data: ContactData) => void;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide">
          Contact Details
        </h2>
        <button
          onClick={onClose}
          className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          &#10005;
        </button>
      </div>
      <StepIndicator current={1} total={3} />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={labelClass}>Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div className="mb-4">
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div className="mb-6">
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            required
            pattern="[0-9]{10}"
            title="Enter a 10-digit phone number"
            className={inputClass}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-full border-2 border-[var(--foreground)] bg-[var(--surface)] px-6 py-3 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-[var(--foreground)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            BACK
          </button>
          <button type="submit" className={buttonClass}>
            NEXT
          </button>
        </div>
      </form>
    </>
  );
}

type AddressData = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
};

function AddressStep({
  data,
  onChange,
  onSubmit,
  onBack,
  onClose,
  loading,
}: {
  data: AddressData;
  onChange: (data: AddressData) => void;
  onSubmit: () => void;
  onBack: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide">
          Shipping Address
        </h2>
        <button
          onClick={onClose}
          className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          &#10005;
        </button>
      </div>
      <StepIndicator current={2} total={3} />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={labelClass}>Address Line 1</label>
          <input
            type="text"
            value={data.addressLine1}
            onChange={(e) =>
              onChange({ ...data, addressLine1: e.target.value })
            }
            required
            className={inputClass}
          />
        </div>
        <div className="mb-4">
          <label className={labelClass}>Address Line 2</label>
          <input
            type="text"
            value={data.addressLine2}
            onChange={(e) =>
              onChange({ ...data, addressLine2: e.target.value })
            }
            className={inputClass}
          />
        </div>
        <div className="mb-4">
          <label className={labelClass}>City</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div className="mb-4">
          <label className={labelClass}>State</label>
          <select
            value={data.state}
            onChange={(e) => onChange({ ...data, state: e.target.value })}
            required
            className={inputClass}
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className={labelClass}>Pincode</label>
          <input
            type="text"
            value={data.pincode}
            onChange={(e) => onChange({ ...data, pincode: e.target.value })}
            required
            pattern="[0-9]{6}"
            title="Enter a 6-digit pincode"
            className={inputClass}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-full border-2 border-[var(--foreground)] bg-[var(--surface)] px-6 py-3 font-[family-name:var(--font-body)] text-sm font-bold uppercase tracking-[0.15em] text-[var(--foreground)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            BACK
          </button>
          <button type="submit" disabled={loading} className={buttonClass}>
            {loading ? "PROCESSING..." : "PAY NOW"}
          </button>
        </div>
      </form>
    </>
  );
}

export default function CheckoutFlowModal({
  lineItems,
  onClose,
}: CheckoutFlowModalProps) {
  const token = useToken();
  const [step, setStep] = useState<"auth" | "contact" | "address">(
    token ? "contact" : "auth"
  );
  const [contact, setContact] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
  });
  const [address, setAddress] = useState<AddressData>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");

  const [createOrder, { loading }] = useAuthMutation(CREATE_ORDER);

  const handleFinalSubmit = async () => {
    setError("");
    try {
      const response = await createOrder({
        lineItems,
        shipping: {
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2 || undefined,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
      });
      const checkoutUrl = response.data?.createOrder?.checkoutUrl;
      if (!checkoutUrl) {
        setError("Failed to create checkout session. Please try again.");
        return;
      }
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Modal open onClose={onClose}>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {step === "auth" && (
        <AuthStep
          onAuth={() => setStep("contact")}
          onClose={onClose}
        />
      )}
      {step === "contact" && (
        <ContactStep
          data={contact}
          onChange={setContact}
          onNext={() => setStep("address")}
          onBack={() => (token ? onClose() : setStep("auth"))}
          onClose={onClose}
        />
      )}
      {step === "address" && (
        <AddressStep
          data={address}
          onChange={setAddress}
          onSubmit={handleFinalSubmit}
          onBack={() => setStep("contact")}
          onClose={onClose}
          loading={loading}
        />
      )}
    </Modal>
  );
}
