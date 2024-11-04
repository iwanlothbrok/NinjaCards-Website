import React from 'react';

type BenefitItemProps = {
    icon: React.ReactNode;
    text: string;
};

const BenefitItem: React.FC<BenefitItemProps> = ({ icon, text }) => (
    <li className="flex items-center space-x-3 text-lg">
        <span className="text-green-500">{icon}</span>
        <span>{text}</span>
    </li>
);

export default BenefitItem;
