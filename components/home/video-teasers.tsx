"use client";

import { motion } from "framer-motion";

export default function VideoTeasers() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              See the Platform in Action
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Watch how we bridge the gap between talented individuals and the
              world's leading tech companies.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Video 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="video-thumbnail relative rounded-3xl overflow-hidden aspect-video bg-muted cursor-pointer group shadow-2xl transition-transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center pl-1 shadow-lg transform transition-transform group-hover:scale-110">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-primary border-b-[10px] border-b-transparent" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 text-white">
                <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-tighter mb-2 inline-block">
                  Demo
                </span>
                <h4 className="font-bold">The Candidate Experience</h4>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center font-medium italic">
              "Found a role in 3 days using my Python score." — Sarah K.
            </p>
          </motion.div>

          {/* Video 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="video-thumbnail relative rounded-3xl overflow-hidden aspect-video bg-muted cursor-pointer group shadow-2xl transition-transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center pl-1 shadow-lg transform transition-transform group-hover:scale-110">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-secondary border-b-[10px] border-b-transparent" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 text-white">
                <span className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-tighter mb-2 inline-block">
                  Product Tour
                </span>
                <h4 className="font-bold">The Recruiter Workflow</h4>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center font-medium italic">
              "Reduced our time-to-hire by 60%." — Talent Acquisition, TechCorp
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
