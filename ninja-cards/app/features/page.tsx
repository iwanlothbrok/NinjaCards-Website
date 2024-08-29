import React from 'react';
import Header from '../components/layout/Header'
interface FeatureProps {
    header: string;
    mainHeader: string;
    imagePath: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
}

const FeatureItemLeftImage: React.FC<FeatureProps> = ({ header, mainHeader, description, imagePath, buttonText, buttonLink }) => {
    return (
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-4 md:px-16 mb-12 md:mb-16">
            <div className="w-full md:w-2/5 md:order-1 mb-6 md:mb-0 md:mr-10">
                <img src={imagePath} alt={mainHeader} className="w-full rounded-lg shadow-md" />
            </div>
            <div className="w-full md:w-2/4 order-2 md:px-16">
                <h4 className='text-sm md:text-lg text-gray-500 uppercase mb-1 md:mb-2'>{header}</h4>
                <h2 className="text-xl md:text-3xl font-bold text-gray-200 mb-2 md:mb-4">{mainHeader}</h2>
                <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
                    {description}
                </p>
                {buttonText && buttonLink && (
                    <a href={buttonLink} className="inline-block bg-black text-white py-2 px-4 mb-5 rounded text-sm md:text-base">
                        {buttonText}
                    </a>
                )}
            </div>
        </div>
    );
}

const FeatureItemRightImage: React.FC<FeatureProps> = ({ header, mainHeader, description, imagePath, buttonText, buttonLink }) => {
    return (
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-4 md:px-16 mb-12 md:mb-16">
            <div className="w-full md:w-2/5 md:order-2 mb-6 md:mb-0 md:ml-16">
                <img src={imagePath} alt={mainHeader} className="w-full rounded-lg h-full shadow-md" />
            </div>
            <div className="w-full md:w-2/4 md:px-10">
                <h4 className='text-sm md:text-lg text-gray-500 uppercase mb-1 md:mb-2'>{header}</h4>
                <h2 className="text-xl md:text-3xl font-bold text-gray-200 mb-2 md:mb-4">{mainHeader}</h2>
                <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
                    {description}
                </p>
                {buttonText && buttonLink && (
                    <a href={buttonLink} className="inline-block bg-black text-white py-2 px-4 mb-5 rounded text-sm md:text-base">
                        {buttonText}
                    </a>
                )}
            </div>
        </div>
    );
}

export default function Features() {
    return (
        <div className="">
            <Header pageInformation='Features' />
            <FeatureItemLeftImage
                header="NFC & QR Code"
                mainHeader="Share Your Contact"
                description="Tapitag NFC digital business card, sharing your contact information is effortless. You can simply tap your TAPiTAG NFC card against another NFC-enabled device, and your Digital Profile will be instantly shared."
                imagePath="/01.webp"
                buttonText="Sample Profile"
                buttonLink="#"
            />

            <FeatureItemRightImage
                header="Exchange Contact Button"
                mainHeader="Lead Generation"
                description="Every TAPiTAG NFC Digital Business Card comes with a powerful Lead Generation Tool that can capture new contacts details by using the 'Exchange Contact' button. This feature allows you to capture leads - The perfect tool to network."
                imagePath="/01.webp"
                buttonText="Sample Profile"
                buttonLink="#"
            />

            <FeatureItemLeftImage
                header="Updating Profile"
                mainHeader="Update Your Details Anytime"
                description="
Tapitag NFC digital business card profile allows you to update your contact information anytime, making it convenient to keep your network updated. With just a tap of your phone, your contacts can access your latest information instantly. Stay connected with ease and make a lasting impression with Tapitag's seamless and modern approach to business cards.
                 "
                imagePath="/01.webp"
                buttonText="Sample Profile"
                buttonLink="#"
            />

            <FeatureItemRightImage
                header="Sharing"
                mainHeader="Download Your QR Code"
                description="
TAPiTAG offers the option to download a QR code for your NFC digital business card, which allows for easy sharing and accessibility of your information. This feature streamlines the process for clients and customers to access your information and provides a seamless user experience. Contact us today to learn more about this option.
                 "
                imagePath="/01.webp"
                buttonText="Sample Profile"
                buttonLink="#"
            />


            <FeatureItemLeftImage
                header="Social Media"
                mainHeader="Fields on your Profile"
                description="
TAPiTAG profiles, you can have over 60 fields to share all the necessary information about your business. This customizable feature allows you to provide all relevant contact information, social media links, and more in one convenient location. You can also creat custom icons and add your custom links.
                 "
                imagePath="/01.webp"
                buttonText="Sample Profile"
                buttonLink="#"
            />
        </div>
    );
}
