"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TROJAN_NAVY = "#0F1B4D";
const TROJAN_GOLD = "#FFC107";

const testimonials = [
  {
    id: 1,
    name: "John Mukwevho",
    location: "Harare",
    image: null,
    rating: 5,
    text: "Excellent service! The solar installation was done professionally and on time. My electricity bills have dropped significantly.",
    service: "Solar Installation",
  },
  {
    id: 2,
    name: "Grace Moyo",
    location: "Bulawayo",
    image: null,
    rating: 5,
    text: "Very impressed with the CCTV system they installed. The team was professional and the quality is top-notch.",
    service: "CCTV Installation",
  },
  {
    id: 3,
    name: "Tendai Chikwanha",
    location: "Mutare",
    image: null,
    rating: 5,
    text: "Great experience from start to finish. The borehole drilling was completed ahead of schedule and works perfectly.",
    service: "Borehole Drilling",
  },
  {
    id: 4,
    name: "Sharon Ncube",
    location: "Gweru",
    image: null,
    rating: 5,
    text: "Highly recommend! The electrical work was done to perfection. Very knowledgeable and friendly technicians.",
    service: "Electrical Wiring",
  },
];

export function TestimonialSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: TROJAN_NAVY }}>
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied customers
            who have experienced our quality service firsthand.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} fill={TROJAN_GOLD} color={TROJAN_GOLD} />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 text-sm mb-6 line-clamp-4">
                "{testimonial.text}"
              </p>

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: TROJAN_NAVY }}
                  >
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  {/* Name and Location */}
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: TROJAN_NAVY }}>
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>

                {/* Service Badge */}
                <div className="mt-3">
                  <span
                    className="inline-block text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${TROJAN_GOLD}20`, color: TROJAN_NAVY }}
                  >
                    {testimonial.service}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
