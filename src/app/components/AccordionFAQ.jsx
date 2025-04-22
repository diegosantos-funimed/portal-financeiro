'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import faqData from '../data/faq.json';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function AccordionFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
      {faqData.map((item, index) => (
        <div key={index} className="border rounded-lg shadow">
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center p-4 text-left"
          >
            <span className="text-lg font-medium">{item.question}</span>
            {openIndex === index ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </button>

          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'anticipate' }}
              >
                <div className="p-4 pt-0 text-gray-600">{item.answer}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
