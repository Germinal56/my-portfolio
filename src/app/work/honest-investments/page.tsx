"use client";

import { useState } from "react";
import Image from "next/image";

export default function NewsletterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agreedToTerms: false,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      setMessage("You must subscribe to the newsletter to receive the ebook.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
        }),
      });
    
      if (response.status === 200) {
        setStatus("success");
        setMessage("The book is on its way! \nCheck your inbox in the next 24h.");
        setFormData({ name: "", email: "", agreedToTerms: false });
      } else {
        throw new Error("Subscription failed");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to subscribe. \nPlease try again later.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col sm:flex-row items-center justify-center sm:p-4 mt-12 sm:mt-0">
        {/* Privacy Policy Popup */}
        {showPrivacyPolicy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold font-playfair text-center mb-4">Privacy Policy</h2>
              <ul className="list-disc pl-5 mb-4 font-latoLight">
                <li>
                  You will respect the rights of the owner of the contents and get access to the resources for personal use only.
                </li>
                <li>
                  You may receive emails from time to time. Emails will be useful and pleasant by design so hopefully you even like them.
                </li>
                <li>You will be subscribed to the newsletter until you unsubscribe.</li>
                <li>
                  Your personal data (name, e-mail) will NOT be shared with third parties. You can ask to delete your data at any moment, just by sending your request to mail@gianlucafornaciari.com or clicking unsubscribe at the bottom of the emails you receive.
                </li>
              </ul>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowPrivacyPolicy(false)}
                  className="bg-red-800 text-white py-2 px-4 font-latoBold hover:bg-red-900 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Section */}
        <div className="sm:w-1/3 w-2/3 my-6 sm:my-0">
          <Image
            src="/honest-investments-cover.webp"
            alt="Honest Investments Cover"
            width={400}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 shadow-lg max-w-md w-full sm:w-2/3"
        >
          <h1 className="text-2xl font-bold mb-4 font-playfair text-center">Get your <u>FREE</u> copy</h1>
          <p className="mb-4">
            Learn personal finance, protect yourself from rip-offs, and start investing on your own today.
          </p>
          <label className="block mb-2 text-gray-600 dark:text-gray-300">
            your *real* name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-700 dark:text-white"
            />
          </label>
          <label className="block mb-2 text-gray-600 dark:text-gray-300">
            your best e-mail <span className="text-xs font-bold text-red-800">(it may take more than 3 hours to receive it)</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              pattern="[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$"
              required
              className="w-full mt-1 p-2 border focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-700 dark:text-white"
            />
          </label>
          <label className="block mb-4 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              required
              className="mr-2"
            />
            I agree to subscribe to the newsletter to receive the ebook.{" "}
            <span
              onClick={() => setShowPrivacyPolicy(true)}
              className="underline cursor-pointer"
            >
              Read the Privacy Policy
            </span>.
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-black hover:bg-gray-800 dark:hover:bg-gray-600 text-white py-2 font-latoBold transition"
          >
            {status === "loading" ? "Submitting..." : "Get the Book"}
          </button>
          {message && (
            <p className={`mt-4 text-center font-latoBold whitespace-pre-line ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
          )}
        </form>
      </div>
      <div className="h-[10vh] sm:hidden block"></div>
    </>
  );
}
