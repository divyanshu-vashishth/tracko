"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AudioLines, X, Sparkles, User, ArrowUp, Trash2 } from "lucide-react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

const SUGGESTED_QUESTIONS = [
    "Analyze my portfolio performance",
    "Which stocks should I consider buying?",
    "What's the latest market news?",
    "How can I diversify my portfolio?",
    "Explain my sector allocation",
];

type NewsItem = {
    title?: string;
};

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
    const getNews = useAction(api.news.getMarketNews);
    const thread = useQuery(api.ai.getThread);
    const ensureThread = useMutation(api.ai.ensureThread);
    const sendMessage = useMutation(api.ai.sendMessage);
    const clearThread = useMutation(api.ai.clearThread);
    const paginatedMessages = useQuery(
        api.ai.listThreadMessages,
        thread?.threadId
            ? {
                threadId: thread.threadId,
                paginationOpts: { cursor: null, numItems: 50 },
            }
            : "skip",
    );

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [newsContext, setNewsContext] = useState("");
    const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Ensure a thread exists for the user.
    useEffect(() => {
        if (thread === null) {
            void ensureThread({});
        }
    }, [thread, ensureThread]);

    // Fetch news context when chat opens
    useEffect(() => {
        if (isOpen && !newsContext) {
            getNews().then((news: NewsItem[]) => {
                if (news?.length) {
                    const newsText = news
                        .slice(0, 30)
                        .map((n) => `- ${n.title ?? "Untitled update"}`)
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
    }, [paginatedMessages, pendingUserMessage, isSending]);

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

    const persistedMessages = (paginatedMessages?.page ?? []).map((message) => ({
        role: message.role as "user" | "assistant",
        content: message.text ?? "",
    }));
    const messages = pendingUserMessage
        ? [...persistedMessages, { role: "user" as const, content: pendingUserMessage }]
        : persistedMessages;
    const lastPersistedMessage = persistedMessages[persistedMessages.length - 1];
    const isAwaitingAssistant =
        !!lastPersistedMessage &&
        lastPersistedMessage.role === "user" &&
        !pendingUserMessage;
    const isLoading = isSending || isAwaitingAssistant;

    const handleSend = async () => {
        if (!input.trim() || isSending) return;

        const userMessage = input.trim();
        setInput("");
        setPendingUserMessage(userMessage);
        setIsSending(true);

        try {
            await sendMessage({
                prompt: userMessage,
                portfolioContext,
                newsContext,
                investorProfile: investorProfileContext,
            });
            setPendingUserMessage(null);
        } catch (error) {
            console.error("Chat error:", error);
            setPendingUserMessage(null);
        } finally {
            setIsSending(false);
        }
    };

    const handleClearChat = async () => {
        try {
            await clearThread({});
            setPendingUserMessage(null);
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
                    "bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
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
                        {persistedMessages.length > 0 && (
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
                                Hi! I&apos;m Tracko AI. I can help you understand your portfolio, analyze market news, and provide investment insights.
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
                                            message.content ? (
                                                <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
                                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                <TypingIndicator />
                                            )
                                        ) : (
                                            <span className="whitespace-pre-wrap wrap-break-word">{message.content}</span>
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
