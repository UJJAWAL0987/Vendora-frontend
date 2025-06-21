import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageCircle, FiUser, FiLoader, FiMessageSquare, FiTrendingUp, FiUsers, FiPackage, FiDollarSign } from 'react-icons/fi';

const AIAssistant = () => {
    const [messages, setMessages] = useState([
        {
            sender: 'ai',
            text: 'Hello! I am your AI Admin Assistant. I can help you analyze your business data, provide insights, and answer questions about your e-commerce platform. How can I assist you today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const examplePrompts = [
        'Which vendor made the highest sales this month?',
        'List underperforming categories.',
        'Suggest discount strategies for slow-moving products.',
        'Show me top 5 customers by order value.',
        'What are the trending products this week?',
        'Generate a sales report for the last quarter.'
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            sender: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Simulate AI response - replace with actual OpenAI API call
            const response = await simulateAIResponse(input);

            const aiMessage = {
                sender: 'ai',
                text: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                sender: 'ai',
                text: 'Sorry, I encountered an error while processing your request. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const simulateAIResponse = async (query) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock responses based on query keywords
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('vendor') && lowerQuery.includes('sales')) {
            return `Based on the latest data, TechGear Pro was the top-performing vendor this month with $12,450 in sales, followed by FitnessFirst with $9,230 and HomeEssentials with $7,890. TechGear Pro showed a 23% increase compared to last month.`;
        } else if (lowerQuery.includes('underperforming') || lowerQuery.includes('slow')) {
            return `Analysis shows that the "Books & Media" category is underperforming with only 15% of expected sales. "Home & Garden" and "Sports Equipment" are also below targets. I recommend:\n\n1. Review pricing strategy for these categories\n2. Consider promotional campaigns\n3. Analyze competitor offerings\n4. Improve product descriptions and images`;
        } else if (lowerQuery.includes('discount') || lowerQuery.includes('strategy')) {
            return `Here are some effective discount strategies for slow-moving products:\n\n1. **Bundle Deals**: Combine slow-moving items with popular products\n2. **Flash Sales**: Create urgency with limited-time offers\n3. **Loyalty Rewards**: Offer discounts to repeat customers\n4. **Seasonal Promotions**: Align with upcoming holidays\n5. **Email Campaigns**: Target customers who viewed these products\n\nWould you like me to generate specific discount codes or promotional content?`;
        } else if (lowerQuery.includes('customer') && lowerQuery.includes('order')) {
            return `Top 5 customers by order value:\n\n1. Sarah Johnson - $2,450 (3 orders)\n2. Michael Chen - $1,890 (2 orders)\n3. Emily Davis - $1,670 (4 orders)\n4. David Wilson - $1,430 (1 order)\n5. Lisa Brown - $1,290 (2 orders)\n\nThese customers represent 18% of total revenue. Consider implementing a VIP program to retain them.`;
        } else if (lowerQuery.includes('trending') || lowerQuery.includes('popular')) {
            return `Current trending products:\n\n1. **Wireless Noise-Canceling Headphones** - 156% increase in views\n2. **Smart Fitness Watch** - 89% increase in sales\n3. **Organic Yoga Mat** - 67% increase in orders\n4. **Bluetooth Speaker** - 45% increase in interest\n5. **Portable Charger** - 34% increase in searches\n\nThese trends suggest strong demand for tech accessories and fitness products.`;
        } else if (lowerQuery.includes('report') || lowerQuery.includes('quarter')) {
            return `**Q3 Sales Report Summary:**\n\n📊 **Total Revenue**: $156,420 (+12.5% vs Q2)\n📦 **Total Orders**: 1,234 (+8.3% vs Q2)\n👥 **New Customers**: 89 (+15.2% vs Q2)\n⭐ **Average Rating**: 4.6/5.0\n\n**Top Categories**:\n- Electronics: $45,230 (29%)\n- Fitness: $32,150 (21%)\n- Home & Garden: $28,940 (18%)\n\n**Recommendations**:\n- Electronics category shows strong growth\n- Consider expanding fitness product line\n- Focus on customer retention strategies`;
        } else {
            return `I understand you're asking about "${query}". I can help you with:\n\n• Sales analytics and reports\n• Customer insights and behavior\n• Product performance analysis\n• Vendor performance tracking\n• Inventory management suggestions\n• Marketing strategy recommendations\n\nPlease try asking a more specific question about your business data, or use one of the example prompts above.`;
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <FiMessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Assistant</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Get intelligent insights about your business
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat Interface */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                        {/* Chat Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                    <FiMessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {isLoading ? 'Typing...' : 'Online'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-96 overflow-y-auto p-6 space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user'
                                            ? 'bg-blue-100 dark:bg-blue-900'
                                            : 'bg-purple-100 dark:bg-purple-900'
                                            }`}>
                                            {message.sender === 'user' ? (
                                                <FiUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            ) : (
                                                <FiMessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            )}
                                        </div>
                                        <div className={`rounded-2xl px-4 py-3 ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                            }`}>
                                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                            <p className={`text-xs mt-2 ${message.sender === 'user'
                                                ? 'text-blue-100'
                                                : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-3 max-w-[80%]">
                                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FiMessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <FiLoader className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask me anything about your business..."
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                        rows={2}
                                        disabled={isLoading}
                                    />
                                </div>
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <FiSend className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Example Prompts */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FiMessageSquare className="w-4 h-4" />
                            Example Questions
                        </h3>
                        <div className="space-y-3">
                            {examplePrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    onClick={() => setInput(prompt)}
                                    className="w-full text-left p-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FiTrendingUp className="w-4 h-4" />
                            Quick Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <FiDollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">$45,230</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <FiUsers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Customers</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">1,234</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                    <FiPackage className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">567</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Capabilities */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">What I can help with:</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>• Sales analytics & reports</li>
                            <li>• Customer insights</li>
                            <li>• Product performance</li>
                            <li>• Vendor analysis</li>
                            <li>• Inventory management</li>
                            <li>• Marketing strategies</li>
                            <li>• Trend predictions</li>
                            <li>• Business recommendations</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant; 
