import React from 'react';

type DropdownSectionProps = {
    title: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
};

const DropdownSection: React.FC<DropdownSectionProps> = ({ title, isOpen, setIsOpen, children }) => (
    <div>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full text-left font-bold text-lg py-4 border-t border-b border-gray-600 flex justify-between items-center text-orange-400"
        >
            {title}
            <span>{isOpen ? '−' : '+'}</span>
        </button>
        {isOpen && <div className="text-gray-300 mt-2 px-2">{children}</div>}
    </div>
);

export default DropdownSection;
