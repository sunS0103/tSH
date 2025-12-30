"use client";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-24 px-6 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold mb-6">
          Ready to upgrade your hiring?
        </h2>
        <p className="text-slate-400 mb-10 text-lg">
          Not sure yet? Explore freely. Take an assessment or browse our network
          without an account. Signup only when you’re ready.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="px-8 py-6 h-auto text-lg bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-2xl"
          >
            Start Free Exploration
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 h-auto text-lg text-white border-slate-700 hover:bg-slate-800 hover:text-white bg-transparent font-bold rounded-2xl"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
}
