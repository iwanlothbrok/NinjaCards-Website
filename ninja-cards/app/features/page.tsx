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
            <Header pageInformation='Функции Ninja Cards' textOne='Споделяне' textTwo='Свързване' textThree='Успех' />
            <FeatureItemLeftImage
                header="NFC & QR код"
                mainHeader="Споделяне на контакти"
                description="С NFC дигиталната визитка на NinjaCard, споделянето на вашите контакти става безпроблемно. Просто докоснете вашата NinjaCard NFC карта към друго устройство с NFC и вашият дигитален профил ще бъде споделен мигновено."
                imagePath="/01.webp"
                buttonText="Примерен профил"
                buttonLink="#"
            />

            <FeatureItemRightImage
                header="Генериране на потенциални клиенти"
                mainHeader="Уловете нови контакти"
                description="Всяка NinjaCard NFC дигитална визитка разполага с мощен инструмент за генериране на нови контакти чрез бутона 'Обмен на контакти'. Тази функция ви позволява лесно да улавяте нови контакти, което я прави идеалния инструмент за разширяване на мрежата ви."
                imagePath="/01.webp"
                buttonText="Научете повече"
                buttonLink="#"
            />

            <FeatureItemLeftImage
                header="Лесни актуализации"
                mainHeader="Актуализирайте информацията си в реално време"
                description="С NinjaCard можете да актуализирате вашата контактна информация по всяко време, като гарантирате, че вашата мрежа винаги разполага с най-новата информация. Просто докоснете вашия телефон, за да споделите актуализирания профил мигновено."
                imagePath="/01.webp"
                buttonText="Актуализирайте сега"
                buttonLink="#"
            />

            <FeatureItemRightImage
                header="NFC срещу традиционни визитки"
                mainHeader="Защо NFC картите са по-добри?"
                description="NFC картите са екологични, многократно използваеми и позволяват мигновено споделяне на информация, за разлика от традиционните хартиени визитки, които лесно се губят или остаряват. Те са съвместими с повечето модерни устройства и осигуряват безпроблемно мрежово свързване."
                imagePath="/01.webp"
                buttonText="Научете повече"
                buttonLink="#"
            />

            <FeatureItemLeftImage
                header="Сигурност"
                mainHeader="Защита на данните"
                description="NFC картите не съхраняват данни сами по себе си, а само задействат прехвърляне на информация към защитен URL, осигурявайки високо ниво на сигурност за вашата лична информация."
                imagePath="/01.webp"
                buttonText="Научете повече"
                buttonLink="#"
            />

            <FeatureItemRightImage
                header="Персонализация"
                mainHeader="Персонализирайте вашата карта"
                description="NinjaCard предлага обширни опции за персонализация, включително брандиране, цветове и дизайни. Персонализирайте NFC визитката си, за да отразява личния или фирмения ви бранд, като я превърнете в запомнящ се и ефективен инструмент за мрежови връзки."
                imagePath="/01.webp"
                buttonText="Персонализирайте сега"
                buttonLink="#"
            />

            <FeatureItemLeftImage
                header="Екологичност"
                mainHeader="Устойчивост"
                description="Използването на NFC карти намалява необходимостта от хартия, подкрепяйки усилията за устойчивост. Тези карти са многократно използваеми, намалявайки въздействието върху околната среда в сравнение с традиционните визитки."
                imagePath="/01.webp"
                buttonText="Изберете екологично"
                buttonLink="#"
            />

            <FeatureItemRightImage
                header="Най-добри практики"
                mainHeader="Максимизирайте ефективността на NFC картата"
                description="Редовно актуализирайте профила си с NFC карта, за да поддържате информацията актуална. По време на събития дръжте NFC картата на достъпни места за лесно споделяне и използвайте QR кодове за потребители без NFC."
                imagePath="/01.webp"
                buttonText="Научете най-добрите практики"
                buttonLink="#"
            />

            <FeatureItemLeftImage
                header="Глобална съвместимост"
                mainHeader="Използвайте я навсякъде"
                description="NFC технологията работи по целия свят, което ви позволява да споделяте своя профил или контактна информация с всеки, навсякъде. Перфектна за международни мрежови връзки и бизнес пътувания."
                imagePath="/09.webp"
                buttonText="Научете повече"
                buttonLink="#"
            />
        </div>
    );
}
