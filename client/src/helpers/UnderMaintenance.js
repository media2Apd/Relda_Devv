import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Hammer, Phone, Clock } from "lucide-react";

const UnderMaintenance = () => {
    // Target Date: April 10, 2026
    const targetDate = new Date("2026-04-10T00:00:00").getTime();
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen w-full bg-[#fcfcfc] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">

            {/* Subtle Indian Brand Background Accents */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#e60000]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#e60000]/5 rounded-full blur-[120px]" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl w-full text-center z-10"
            >
                {/* Animated Brand Icon */}
                <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-2xl mb-8 border border-gray-100"
                >
                    <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Hammer size={42} className="text-[#e60000]" />
                    </motion.div>
                </motion.div>

                {/* Status Line */}
                <motion.div variants={itemVariants} className="flex justify-center mb-4">
                    <span className="flex items-center gap-2 px-4 py-1 rounded-full bg-[#e60000]/10 text-[#e60000] text-xs font-bold uppercase tracking-widest border border-[#e60000]/20">
                        <span className="w-2 h-2 bg-[#e60000] rounded-full animate-ping" />
                        Scheduled System Upgrade
                    </span>
                </motion.div>

                {/* Main Text */}
                <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-black text-[#1a1a1a] mb-6 leading-tight">
                    REFINING OUR <br /> <span className="text-[#e60000]">DIGITAL STOREFRONT</span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-[#555] text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
                    Our platform is undergoing essential maintenance to enhance your shopping experience. We’ll be serving you again very soon!
                </motion.p>

                {/* Countdown Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 px-4">
                    {[
                        { label: "Days", value: timeLeft.days },
                        { label: "Hours", value: timeLeft.hours },
                        { label: "Minutes", value: timeLeft.minutes },
                        { label: "Seconds", value: timeLeft.seconds },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white border-b-4 border-[#e60000] rounded-2xl p-6 shadow-xl shadow-gray-200/50">
                            <div className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-1">
                                {String(item.value).padStart(2, '0')}
                            </div>
                            <div className="text-[10px] font-bold text-[#e60000] uppercase tracking-[0.2em]">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Contact Information Card */}
                <motion.div variants={itemVariants} className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 mb-12">
                    <div className="text-left space-y-4">
                        <h4 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                            <Clock size={18} className="text-[#e60000]" /> Expected Launch
                        </h4>
                        <p className="text-[#555] text-sm">Our team is working 24/7 to go live by <br /><span className="font-bold text-[#1a1a1a]">10th April 2026, 09:00 AM IST</span></p>
                    </div>
                    <div className="text-left space-y-4">
                        <h4 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                            <Phone size={18} className="text-[#e60000]" /> Support Details
                        </h4>
                        <div className="space-y-1">
                            <p className="text-[#555] text-sm flex items-center gap-2">
                                <strong>WhatsApp:</strong> +91 98848 90934
                            </p>
                            <p className="text-[#555] text-sm flex items-center gap-2">
                                <strong>Email:</strong> support@reldaindia.com
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default UnderMaintenance;