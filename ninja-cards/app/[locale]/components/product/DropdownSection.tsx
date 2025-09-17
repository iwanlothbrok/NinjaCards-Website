import React from 'react';
import { motion } from 'framer-motion';

type DropdownSectionProps = {
    title: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
};

const DropdownSection: React.FC<DropdownSectionProps> = ({ title, isOpen, setIsOpen, children }) => (
    <div className="border-t border-b border-gray-600">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full text-left font-bold text-lg py-4 flex justify-between items-center text-orange "
            aria-expanded={isOpen}
        >
            {title}
            <span
                className={`text-3xl transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
            >
                ▼
            </span>
        </button>
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
        >
            <div className="text-gray-300 mt-1 px-4 py-2">{children}</div>
        </motion.div>
    </div>
);

export default DropdownSection;
