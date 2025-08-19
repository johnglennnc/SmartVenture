import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function CollapsibleMenuItem({ item }) {
  const location = useLocation();
  const hasActiveSubItem = item.subItems.some(sub => location.pathname === sub.url);
  
  const [isOpen, setIsOpen] = useState(
    hasActiveSubItem || localStorage.getItem(`collapsible-menu-${item.title}`) !== 'false'
  );

  useEffect(() => {
    localStorage.setItem(`collapsible-menu-${item.title}`, isOpen);
  }, [isOpen, item.title]);
  
  useEffect(() => {
    if (hasActiveSubItem) {
      setIsOpen(true);
    }
  }, [hasActiveSubItem]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls={`collapsible-content-${item.title}`}
        aria-label={`Toggle ${item.title} subitems`}
        className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          hasActiveSubItem
            ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white'
            : 'text-blue-200/70 hover:text-white hover:bg-white/5'
        }`}
      >
        <item.icon className="w-5 h-5" />
        <span className="font-medium">{item.title}</span>
        <ChevronDown
          className={`w-5 h-5 ml-auto transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        id={`collapsible-content-${item.title}`}
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0">
            <div className="pt-2 pl-6 space-y-1">
                {item.subItems.map((subItem) => (
                    <Link
                        key={subItem.title}
                        to={subItem.url}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${
                            location.pathname === subItem.url
                            ? 'text-cyan-400 bg-cyan-400/10'
                            : 'text-blue-200/60 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <subItem.icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{subItem.title}</span>
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}