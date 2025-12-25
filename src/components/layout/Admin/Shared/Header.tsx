import React from 'react';

export default function Header() {
    return (
        <header className="bg-white border-b border-border-subtle px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            {/* Search & Breadcrumb Placeholder */}
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xl">search</span>
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-background-light border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors placeholder:text-text-secondary/70 outline-none"
                        placeholder="Search for users, courses, or orders..."
                        type="text"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full text-text-secondary hover:bg-background-light hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full border border-white"></span>
                </button>
                <button className="p-2 rounded-full text-text-secondary hover:bg-background-light hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">help</span>
                </button>
            </div>
        </header>
    );
}
