import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Image from 'next/image'

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
        <section className="relative overflow-hidden bg-background py-20 md:py-32">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] opacity-40 pointer-events-none">
                <div className="absolute left-0 top-0 w-1/2 h-full bg-secondary/20 blur-[100px] rounded-full mix-blend-multiply" />
                <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/20 blur-[100px] rounded-full mix-blend-multiply" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                        Frequently asked questions
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        If you can't find what you're looking for, email our support team and if you're lucky someone will get back to you.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-3xl">
                    <Accordion className="w-full space-y-4">
                        {faqItems.map((item) => (
                            <AccordionItem key={item.id} value={item.id} className="border-b-0 rounded-2xl bg-muted/50 px-6">
                                <AccordionTrigger className="text-base font-semibold text-foreground hover:no-underline py-4">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-6 text-base">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                
                <div className="mt-24 flex justify-center">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="Tracko Logo" width={32} height={32} />
                        <span className="font-bold text-xl text-foreground">Tracko</span>
                    </div>
                </div>
            </div>
        </section>
    )
}