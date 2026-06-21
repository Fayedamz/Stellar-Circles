"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import type { RegisterInput, AuthResponse } from "@stellar-circles/shared";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterInput & { confirmPassword: string }>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    stellarAddress: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post<AuthResponse>("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        stellarAddress: form.stellarAddress || undefined,
      });
      localStorage.setItem("sc_token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
        <input
          type="text"
          required
          minLength={3}
          maxLength={30}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          {...field("username")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          {...field("email")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input
          type="password"
          required
          minLength={8}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          {...field("password")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
        <input
          type="password"
          required
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          {...field("confirmPassword")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Stellar Address{" "}
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="G..."
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          {...field("stellarAddress")}
        />
        <p className="text-xs text-slate-400 mt-1">Link your Stellar account for activity anchoring</p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
