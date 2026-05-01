import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8 md:flex md:items-center md:justify-between">
        <div className="flex justify-center md:order-2 space-x-6">
          <a
            href="https://x.com/ashdev_me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-500"
          >
            <span className="sr-only">X (Twitter)</span>
            <Twitter className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href="https://github.com/divyanshu-vashishth/tracko"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-500"
          >
            <span className="sr-only">GitHub</span>
            <Github className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-slate-500">
            Copyright &copy; {new Date().getFullYear()} Tracko. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}