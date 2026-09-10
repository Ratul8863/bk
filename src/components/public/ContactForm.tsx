'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (submitted) {
    return (
      <div className="border border-accent/30 bg-sage/40 px-6 py-10 md:px-8">
        <p className="font-display text-2xl text-ink">Thank you</p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Your message has been recorded in this preview. For a live enquiry,
          please email BKSR using the addresses listed on this page.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Subject</span>
        <input
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Message</span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <Button type="submit" variant="primary">
        Send message
      </Button>
    </form>
  );
}
