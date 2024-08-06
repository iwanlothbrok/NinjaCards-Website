import React from 'react';
import IconListItem from './IconListItem';

const FeatureRow: React.FC<{ title: string, description: string, listItems: string[], imgSrc: string, reverse?: boolean }> = ({ title, description, listItems, imgSrc, reverse = false }) => {
    return (
        <div className={`items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
            <div className={`text-gray-500 sm:text-lg dark:text-gray-400 ${reverse ? 'lg:pl-12' : 'lg:pr-12'}`}>
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{title}</h2>
                <p className="mb-8 font-light lg:text-xl">{description}</p>
                <ul role="list" className="pt-8 space-y-5 border-t border-gray-200 my-7 dark:border-gray-700">
                    {listItems.map((item, index) => (
                        <IconListItem key={index} text={item} />
                    ))}
                </ul>
                <p className="font-light lg:text-xl">{description}</p>
            </div>
            <img className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex" src={imgSrc} alt="feature image" />
        </div>
    );
};

export default FeatureRow;
