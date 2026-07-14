import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      heading: "Growing Together with RELDA",
      text: "Partnering with RELDA helped us establish a strong presence in our local market. Their branding and marketing support made a real difference.",
      signature: "Authorized Dealer",
      highlight: false,
    },
    {
      heading: "From Retailer to Trusted Appliance Store",
      text: "With RELDA's quality products and business guidance, we expanded our customer base and increased sales within months.",
      signature: "Dealer Partner",
      highlight: true, // This card stands out with the red border
    },
    {
      heading: "Building a Successful Business",
      text: "RELDA's training, attractive margins, and dedicated support gave us the confidence to grow our business with a trusted brand.",
      signature: "Authorized Dealer",
      highlight: false,
    },
  ];

  return (
    <section className="bg-[#1a2332] py-16 px-4 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-white text-4xl md:text-6xl font-bold tracking-tight">
            Voices of Success
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className={`
                relative p-10 rounded-[2.5rem] transition-all duration-500 flex flex-col justify-between
                ${review.highlight 
                  ? "bg-[#2d3748] border-2 border-brand-primary shadow-2xl shadow-red-900/30 scale-105 z-10" 
                  : "bg-[#2d3748]/60 border border-white/10"
                }
              `}
            >
              {/* Header Icon & Star Rating */}
              <div className="mb-8">
                <Quote className={`w-10 h-10 mb-6 ${review.highlight ? 'text-brand-primary' : 'text-white/20'}`} />
                <h4 className="text-white text-2xl font-bold leading-tight mb-4">
                  {review.heading}
                </h4>
              </div>

              {/* Testimonial Quote */}
              <div className="flex-grow">
                <p className="text-gray-300 text-lg italic leading-relaxed mb-8">
                  "{review.text}"
                </p>
              </div>

              {/* Signature & Stars */}
              <div className="mt-auto pt-6 border-t border-white/10">
                <p className={`text-sm font-bold uppercase tracking-widest mb-4 ${review.highlight ? 'text-brand-primary' : 'text-gray-400'}`}>
                   — {review.signature}
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;