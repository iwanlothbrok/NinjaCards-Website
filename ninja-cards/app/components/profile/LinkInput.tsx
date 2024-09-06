'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type LinkInputProps = {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    iconSrc: string;
    focusRingColor: string;
};

const LinkInput: React.FC<LinkInputProps> = React.memo(({ name, value, onChange, placeholder, iconSrc, focusRingColor }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <div className="flex items-center bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Image
                src={iconSrc}
                alt={`${name} икона`}
                width={40}
                height={40}
                priority
                className={`mr-4 transition-colors duration-300 ${isFocused ? focusRingColor : 'text-gray-400'} !important`}
            />
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="flex-grow bg-transparent text-gray-200 border-none focus:ring-0 placeholder-gray-400 focus:outline-none"
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </div>
    );
});

LinkInput.displayName = 'LinkInput';

export default LinkInput;