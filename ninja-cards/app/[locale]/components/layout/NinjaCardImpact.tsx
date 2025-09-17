import { useState } from 'react';

const DEFAULT_CARDS = 50;
const MIN_CARDS = 1;
const MAX_CARDS = 5000;

const formatNumber = (num: number) =>
    num.toLocaleString(undefined, { maximumFractionDigits: 0 });

const NinjaCardImpact = () => {
    const [cardsSold, setCardsSold] = useState(DEFAULT_CARDS);
    const [inputError, setInputError] = useState('');

    const handleInput = (val: number) => {
        if (val < MIN_CARDS || val > MAX_CARDS) {
            setInputError(`Please enter a value between ${MIN_CARDS} and ${MAX_CARDS}.`);
        } else {
            setInputError('');
            setCardsSold(val);
        }
    };

    const paperSaved = cardsSold * 100;
    const treesSaved = (cardsSold * 0.7).toFixed(0);
    const co2Saved = (cardsSold * 4).toFixed(0);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white py-12">
            <div className="w-full max-w-4xl bg-black bg-opacity-80 p-8 rounded-3xl shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Environmental Impact Calculator
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Discover the positive impact of switching to Ninja Cards.
                    </p>
                </div>

                {/* Input Section */}
                <div className="mb-8">
                    <label
                        className="block text-gray-300 font-medium mb-2"
                        htmlFor="cardsSold"
                    >
                        Number of Ninja Cards Sold
                    </label>
                    <div className="flex items-center gap-3">
                            <button
                            aria-label="Decrease"
                            className="bg-gray-700 text-white px-3 py-2 rounded-l-lg hover:bg-gray-600 transition"
                            onClick={() => handleInput(cardsSold - 1)}
                            disabled={cardsSold <= MIN_CARDS}
                        >-</button>
                        <input
                            id="cardsSold"
                            type="number"
                            min={MIN_CARDS}
                            max={MAX_CARDS}
                            value={cardsSold}
                            onChange={(e) => handleInput(Number(e.target.value))}
                            className="w-28 px-3 py-2 text-black border border-gray-500 rounded-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-lg text-center"
                        />
                        <button
                            aria-label="Increase"
                            className="bg-gray-700 text-white px-3 py-2 rounded-r-lg hover:bg-gray-600 transition"
                            onClick={() => handleInput(cardsSold + 1)}
                            disabled={cardsSold >= MAX_CARDS}
                        >+</button>
                        <input
                            type="range"
                            min={MIN_CARDS}
                            max={MAX_CARDS}
                            value={cardsSold}
                            onChange={(e) => handleInput(Number(e.target.value))}
                            className="flex-1 h-2 bg-blue-600 rounded-lg cursor-pointer accent-blue-500 ml-4"
                        />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Enter a value between {MIN_CARDS} and {MAX_CARDS}.
                    </div>
                    {inputError && (
                        <div className="text-xs text-red-400 mt-1">{inputError}</div>
                    )}
                </div>

                {/* Impact Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition">
                        <p className="text-blue-400 font-semibold mb-1">Paper Cards Saved</p>
                        <p className="text-2xl font-bold text-white">{formatNumber(paperSaved)}</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition">
                        <p className="text-green-400 font-semibold mb-1">Trees Saved</p>
                        <p className="text-2xl font-bold text-white">{treesSaved}</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition">
                        <p className="text-yellow-400 font-semibold mb-1">CO₂ Reduced</p>
                        <p className="text-2xl font-bold text-white">{co2Saved} kg</p>
                    </div>
                </div>

                {/* Impact Stats Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    Calculations are estimates based on industry averages.
                </div>

                {/* Reset Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition"
                        onClick={() => handleInput(DEFAULT_CARDS)}
                        disabled={cardsSold === DEFAULT_CARDS}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NinjaCardImpact;
