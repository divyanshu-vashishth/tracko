"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AudioLines, X, Send, Sparkles, User, ArrowUp, Trash2 } from "lucide-react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp?: number;
}

const SUGGESTED_QUESTIONS = [
    "Analyze my portfolio performance",
    "Which stocks should I consider buying?",
    "What's the latest market news?",
    "How can I diversify my portfolio?",
    "Explain my sector allocation",
];

// Typing dots animation component
function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 py-2 px-1">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
    );
}

export function AIChatbot() {
    const holdings = useQuery(api.portfolios.getHoldings);
    const preferences = useQuery(api.portfolios.getUserPreferences);
    const chatHistory = useQuery(api.chatHistory.getChatHistory);
    const getNews = useAction(api.news.getMarketNews);
    const chat = useAction(api.ai.chat);
    const saveChatHistory = useMutation(api.chatHistory.saveChatHistory);
    const clearChatHistory = useMutation(api.chatHistory.clearChatHistory);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [newsContext, setNewsContext] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Load chat history on mount
    useEffect(() => {
        if (chatHistory?.messages) {
            setMessages(chatHistory.messages.map(m => ({
                role: m.role,
                content: m.content,
                timestamp: m.timestamp,
            })));
        }
    }, [chatHistory]);

    // Fetch news context when chat opens
    useEffect(() => {
        if (isOpen && !newsContext) {
            getNews().then((news) => {
                if (news) {
                    const newsText = news
                        .slice(0, 30)
                        .map((n: any) => `- ${n.title}`)
                        .join("\n");
                    setNewsContext(newsText);
                }
            }).catch(console.error);
        }
    }, [isOpen, newsContext, getNews]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
        }
    }, [input]);

    // Build portfolio context
    const portfolioContext = holdings
        ? `Holdings:\n${holdings.map((h) =>
            `- ${h.symbol}: ${h.shares} shares @ ₹${h.avgPurchasePrice} (Sector: ${h.sector || "Unknown"})`
        ).join("\n")}\n\nTotal holdings: ${holdings.length}`
        : "No holdings in portfolio";

    // Build investor profile context
    const investorProfileContext = preferences?.investorProfile
        ? `Investor Profile:\n- Risk Appetite: ${preferences.investorProfile.riskAppetite}\n- Investment Horizon: ${preferences.investorProfile.investmentHorizon || "Not specified"}\n- Investment Goals: ${preferences.investorProfile.investmentGoals || "Not specified"}\n- Monthly Investment: ₹${preferences.investorProfile.monthlyInvestment || "Not specified"}`
        : "";

    // Build conversation history for AI context (last 10 messages)
    const conversationHistory = messages.slice(-10).map(m =>
        `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
    ).join("\n\n");

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        const timestamp = Date.now();
        setInput("");

        const newMessages = [...messages, { role: "user" as const, content: userMessage, timestamp }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Include conversation history in context
            const fullContext = `${portfolioContext}\n\n${investorProfileContext}\n\nRecent Conversation:\n${conversationHistory}\n\nUser: ${userMessage}`;

            const result = await chat({
                message: userMessage,
                portfolioContext: fullContext,
                newsContext,
            });

            const assistantMessage = { role: "assistant" as const, content: result.response, timestamp: Date.now() };
            const updatedMessages = [...newMessages, assistantMessage];
            setMessages(updatedMessages);

            // Save to database
            await saveChatHistory({
                messages: updatedMessages.map(m => ({
                    role: m.role,
                    content: m.content,
                    timestamp: m.timestamp || Date.now(),
                })),
            });
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage = { role: "assistant" as const, content: "Sorry, I encountered an error. Please try again.", timestamp: Date.now() };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = async () => {
        try {
            await clearChatHistory({});
            setMessages([]);
        } catch (error) {
            console.error("Failed to clear chat:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestedQuestion = (question: string) => {
        setInput(question);
        textareaRef.current?.focus();
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 rounded-full p-4 shadow-lg transition-all duration-300",
                    "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
                    "text-primary-foreground",
                    isOpen && "scale-0 opacity-0"
                )}
            >
                <AudioLines className="h-6 w-6" />
            </button>

            {/* Chat Window */}
            <div
                className={cn(
                    "fixed bottom-6 right-6 z-50 transition-all duration-300",
                    "w-[420px] h-[600px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-100px)]",
                    "bg-background border rounded-2xl shadow-2xl overflow-hidden",
                    "flex flex-col",
                    isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Tracko AI</h3>
                            <p className="text-xs text-muted-foreground">Your portfolio assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {messages.length > 0 && (
                            <Button variant="ghost" size="icon" onClick={handleClearChat} title="Clear chat">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
                    {messages.length === 0 ? (
                        <div className="space-y-4">
                            <p className="text-center text-muted-foreground text-sm">
                                Hi! I'm Tracko AI. I can help you understand your portfolio, analyze market news, and provide investment insights.
                            </p>
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
                                {SUGGESTED_QUESTIONS.map((question, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSuggestedQuestion(question)}
                                        className="block w-full text-left text-sm px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex gap-2",
                                        message.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {message.role === "assistant" && (
                                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "rounded-2xl px-4 py-2.5 max-w-[85%] text-sm",
                                            message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}
                                    >
                                        {message.role === "assistant" ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
                                                <ReactMarkdown>{message.content}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <span className="whitespace-pre-wrap break-words">{message.content}</span>
                                        )}
                                    </div>
                                    {message.role === "user" && (
                                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                                            <User className="h-4 w-4 text-primary-foreground" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 justify-start">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                    </div>
                                    <TypingIndicator />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input Area - Multi-line textarea */}
                <div className="border-t bg-muted/20 p-4">
                    <div className="relative bg-background border rounded-xl shadow-sm">
                        <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message here..."
                            disabled={isLoading}
                            className="min-h-[44px] max-h-[120px] resize-none border-0 pr-12 focus-visible:ring-0 bg-transparent"
                            rows={1}
                        />
                        <Button
                            onClick={handleSend}
                            size="icon"
                            disabled={isLoading || !input.trim()}
                            className="absolute bottom-2 right-2 h-8 w-8 rounded-lg"
                        >
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
