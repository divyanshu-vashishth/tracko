import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQs() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How do I add stocks to my portfolio?',
            answer: 'You can add stocks manually by searching for the ticker symbol, or use our AI-powered screenshot import feature. Simply upload a screenshot from your broker app and we\'ll automatically extract the holdings.',
        },
        {
            id: 'item-2',
            question: 'Where does the stock data come from?',
            answer: 'We fetch real-time stock prices from Yahoo Finance API. Prices are updated live when you view your portfolio, ensuring you always see the latest market values.',
        },
        {
            id: 'item-3',
            question: 'Can I track both Indian and US stocks?',
            answer: 'Yes! We support stocks from NSE, BSE (India) as well as US markets like NYSE and NASDAQ. Just add the appropriate ticker symbol (e.g., RELIANCE.NS for NSE, AAPL for NASDAQ).',
        },
        {
            id: 'item-4',
            question: 'Is my portfolio data secure?',
            answer: 'Absolutely. Your data is stored securely in Convex, a real-time database with enterprise-grade security. We use Google OAuth for authentication and never store any broker credentials.',
        },
        {
            id: 'item-5',
            question: 'How does the benchmark comparison work?',
            answer: 'We compare your portfolio\'s performance against major indices like Nifty 50, Sensex, and S&P 500 over various time periods. This helps you understand if your stock picks are outperforming the market.',
        },
    ]

    return (
        <section className="relative py-16 md:py-24">
            {/* Simple light bluish gradient - top half sky, bottom half white/background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-sky-50/50 to-background dark:from-sky-950/30 dark:via-sky-900/10 dark:to-background" />

            <div className="relative mx-auto max-w-5xl px-6">
                <div className="grid gap-8 md:grid-cols-5 md:gap-12">
                    <div className="md:col-span-2">
                        <h2 className="text-foreground text-3xl md:text-4xl font-bold">FAQs</h2>
                        <p className="text-muted-foreground mt-4 text-balance text-lg">Your questions answered</p>
                        <p className="text-muted-foreground mt-6 hidden md:block">
                            Can't find what you're looking for? Contact us on{' '}
                            <Link
                                href="https://github.com"
                                target="_blank"
                                className="text-primary font-medium hover:underline">
                                GitHub
                            </Link>
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <Accordion>
                            {faqItems.map((item) => (
                                <AccordionItem key={item.id} value={item.id}>
                                    <AccordionTrigger className="cursor-pointer text-base hover:no-underline text-left">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-base text-muted-foreground">{item.answer}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    <p className="text-muted-foreground mt-6 md:hidden">
                        Can't find what you're looking for? Contact us on{' '}
                        <Link
                            href="https://github.com"
                            target="_blank"
                            className="text-primary font-medium hover:underline">
                            GitHub
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}