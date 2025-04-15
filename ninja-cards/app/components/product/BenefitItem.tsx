import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IconType } from 'react-icons/lib';

type BenefitItemProps = {
    title: string;
    subtitle: string;
    icon: IconType;
    
};

const BenefitItem: React.FC<BenefitItemProps> = ({ title, subtitle, icon }) => (
    <li className="flex items-start space-x-4 text-lg group">
        <div className="flex-shrink-0 text-orange group-hover:text-yellow-600 transition-colors duration-300">
            {React.createElement(icon, { className: "text-2xl transition-transform transform group-hover:scale-110 duration-300" })}
        </div>
        <div className="transition-transform transform group-hover:scale-105 group-hover:translate-x-2 duration-300">
            <h3 className="font-semibold text-xl text-orange group-hover:text-yellow-600 transition-colors duration-300">
                {title}
            </h3>
            <p className="text-gray-100 group-hover:text-gray-300 transition-colors duration-300">
                {subtitle}
            </p>
        </div>
    </li>
);

export default BenefitItem;
