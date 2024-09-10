'use client';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FrequentlyAskedQuestionsProps {
  searchTerm: string;
}
const faqData = [
  {
    category: 'Обща информация',
    items: [
      {
        question: 'Какво е NFC Карта?',
        answer: `NFC (Комуникация на близко разстояние) карта е интелигентна карта, която може да взаимодейства с устройства, поддържащи NFC, като смартфони. Просто докоснете Ninja NFC картата си до телефон и мигновено споделете вашата контактна информация, профили в социални мрежи или друго дигитално съдържание. Това е като да имате личен нинджа асистент за мрежови връзки!`,
      },
      {
        question: 'Как да използвам моята Ninja NFC Карта?',
        answer: `Просто докоснете вашата Ninja NFC карта до всяко устройство с NFC, и вашият персонализиран профил или информация ще бъде споделена мигновено. Не е необходима инсталация на приложение! Това е стелт и безпроблемен начин за свързване.`,
      },
    ],
  },
  {
    category: 'Персонализиране',
    items: [
      {
        question: 'Мога ли да персонализирам моята Ninja NFC Карта?',
        answer: `Абсолютно! Можете да изберете от разнообразие от дизайни или дори да качите ваш собствен. Персонализирайте своята Ninja NFC карта, за да съответства на вашия стил и марка. Това е вашият нинджа, вашите правила!`,
      },
      {
        question: 'Как да актуализирам информацията на моята Ninja NFC Карта?',
        answer: `Можете лесно да актуализирате информацията на вашата Ninja NFC карта чрез нашия онлайн портал. Просто влезте в системата, направете промените и картата ви ще бъде актуализирана незабавно. Няма нужда от нова карта – вашият нинджа се адаптира към вашите нужди!`,
      },
    ],
  },
  {
    category: 'Защита',
    items: [
      {
        question: 'Данните ми сигурни ли са с Ninja NFC картите?',
        answer: `Да, вашите данни са в безопасност с Ninja NFC картите. Картата не съхранява никакви данни сама по себе си; тя просто задейства трансфер на информация към защитен URL. Вашите лични данни винаги са защитени, осигурявайки ниво на сигурност като нинджа.`,
      },
    ],
  },
  {
    category: 'Съвместимост',
    items: [
      {
        question: 'Работят ли Ninja NFC картите на всички телефони?',
        answer: `Ninja NFC картите са съвместими с повечето модерни смартфони, които поддържат NFC технология, включително iPhone (iPhone 7 и по-късни модели) и повечето Android устройства. Това е като да имате нинджа, който знае всички движения!`,
      },
    ],
  },
  {
    category: 'NFC продукти от Ninja Cards',
    items: [
      {
        question: 'Какви са предимствата на умните визитни картички?',
        answer: `Умните визитни картички на Ninja Cards предлагат множество предимства като ефективност при мрежовото свързване, екологична устойчивост чрез повторна употреба и възможност за персонализация.`,
      },
      {
        question: 'Как да започна да използвам продуктите на Ninja Cards?',
        answer: `Започването с NFC продуктите на Ninja Cards е лесно. За умните визитни картички, можете да ги програмирате чрез нашата платформа, а NFC стикерите могат да се приложат към всякаква повърхност.`,
      },
    ],
  },
  {
    category: 'Интеграция на отзивите на Google',
    items: [
      {
        question: 'Как работи интеграцията с Google Reviews?',
        answer: `Чрез NFC технологията, клиентите могат да бъдат насочени към страницата за Google отзиви чрез докосване на NFC стикер или карта. Това улеснява оставянето на рецензии.`,
      },
    ],
  },
  {
    category: 'Стикери NFC',
    items: [
      {
        question: 'Как мога да използвам NFC стикерите в бизнеса си?',
        answer: `NFC стикерите могат да бъдат поставени на продукти, рекламни материали или на касовите апарати за бърз достъп до уебсайтове или контактна информация.`,
      },
      {
        question: 'Какви функции мога да персонализирам на NFC стикерите?',
        answer: `Можете да персонализирате функциите на NFC стикерите, като ги настроите да водят до специфични уебсайтове, контактна информация или дори да показват Google рецензии.`,
      },
    ],
  },
  {
    category: 'Опции за персонализиране',
    items: [
      {
        question: 'Какви възможности за персонализация предлагате?',
        answer: `Ninja Cards предлага широка гама от опции за персонализация, включително дизайн, материал и функционалност, за да съответства на нуждите на вашия бизнес.`,
      },
      {
        question: 'Мога ли да направя групова поръчка?',
        answer: `Да, Ninja Cards предлага опции за поръчка на едро за фирми, които искат да снабдят целия си екип с NFC продукти.`,
      },
    ],
  },
  {
    category: 'Функции за сигурност',
    items: [
      {
        question: 'Колко сигурни са продуктите на Ninja Cards?',
        answer: `Ninja Cards осигурява надеждни функции за сигурност за всички NFC продукти, като защитава данните на потребителите и осигурява високо ниво на безопасност.`,
      },
      {
        question: 'Може ли NFC картата да бъде компрометирана?',
        answer: `Не, NFC картите на Ninja Cards не съхраняват лични данни и само задействат трансфер към защитен URL, което гарантира висока сигурност.`,
      },
    ],
  },
  {
    category: 'Проследяване и анализ',
    items: [
      {
        question: 'Мога ли да проследявам взаимодействията с NFC продуктите си?',
        answer: `Да, Ninja Cards предоставя аналитични инструменти за проследяване на взаимодействията с NFC продуктите, като предоставя ценни данни за тяхната ефективност.`,
      },
      {
        question: 'Как работи проследяването на данни?',
        answer: `Чрез аналитичния портал на Ninja Cards можете да виждате колко често вашите NFC продукти се използват, както и други данни за ефективността.`,
      },
    ],
  },
  {
    category: 'Международна употреба',
    items: [
      {
        question: 'Работят ли NFC продуктите на Ninja Cards по света?',
        answer: `Да, NFC продуктите на Ninja Cards работят в международен план, което ги прави подходящи за фирми с международни клиенти.`,
      },
      {
        question: 'Има ли ограничения за използването на NFC продуктите в различни държави?',
        answer: `Няма географски ограничения за използването на NFC продуктите. Те са съвместими с NFC стандартите по света.`,
      },
    ],
  },
  {
    category: 'Дълготрайност',
    items: [
      {
        question: 'Колко издръжливи са умните визитни картички?',
        answer: `Умните визитни картички на Ninja Cards са проектирани да бъдат издръжливи и устойчиви на износване, като гарантират дълготрайна употреба.`,
      },
      {
        question: 'Мога ли да мия NFC стикерите?',
        answer: `Да, NFC стикерите са водоустойчиви и могат да издържат на контакт с вода, без да губят своята функционалност.`,
      },
    ],
  },
];


const FrequentlyAskedQuestions: React.FC<FrequentlyAskedQuestionsProps> = ({
  searchTerm,
}) => {
  const [activeIndex, setActiveIndex] = useState<{
    category: number;
    item: number;
  } | null>(null);

  const toggleFAQ = (categoryIndex: number, itemIndex: number) => {
    if (
      activeIndex?.category === categoryIndex &&
      activeIndex.item === itemIndex
    ) {
      setActiveIndex(null);
    } else {
      setActiveIndex({ category: categoryIndex, item: itemIndex });
    }
  };

  const filteredFAQs = faqData.map((category) => ({
    ...category,
    items: category.items.filter(
      (faq) =>
        (faq.question &&
          faq.question
            .toLowerCase()
            .includes((searchTerm || '').toLowerCase())) ||
        (faq.answer &&
          faq.answer.toLowerCase().includes((searchTerm || '').toLowerCase()))
    ),
  }));

  return (
    <section className=" bg-darkBg2 text-white">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="space-y-12">
          {filteredFAQs.map((category, categoryIndex) =>
            category.items.length > 0 ? (
              <div key={categoryIndex}>
                <h3 className="text-3xl font-bold text-gray-100 mb-8 border-b-2 border-gray-700 pb-2">
                  {category.category}
                </h3>
                <div className="space-y-6">
                  {category.items.map((faq, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform ${activeIndex?.category === categoryIndex &&
                        activeIndex?.item === itemIndex
                        ? 'scale-105'
                        : 'scale-100'
                        }`}
                    >
                      <div
                        onClick={() => toggleFAQ(categoryIndex, itemIndex)}
                        className="flex justify-between items-center cursor-pointer"
                      >
                        <h4 className="text-xl font-semibold">
                          {faq.question}
                        </h4>
                        <span className="text-orange">
                          {activeIndex?.category === categoryIndex &&
                            activeIndex?.item === itemIndex ? (
                            <FaChevronUp size={24} />
                          ) : (
                            <FaChevronDown size={24} />
                          )}
                        </span>
                      </div>
                      <div
                        className={`overflow-hidden transition-all duration-500 ${activeIndex?.category === categoryIndex &&
                          activeIndex?.item === itemIndex
                          ? 'max-h-[200px] opacity-100'
                          : 'max-h-0 opacity-0'
                          }`}
                      >
                        <p className="mt-4 text-gray-300">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
