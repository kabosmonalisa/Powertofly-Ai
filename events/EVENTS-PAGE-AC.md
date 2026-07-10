# Events page — Acceptance Criteria

## Overview
The events page has **two states**, driven only by whether a PowerToFly flagship
event (summit or virtual job fair) is currently live:

- **Default state** — no event is live right now.
- **Live state** — an event is live (current time is within its start–end window).

The page automatically switches between the two based on the event schedule; no
manual/editorial toggle is needed in production. (The dashed **"Preview live
event"** control in the prototype is dev-only and must be removed before ship.)

---

## Featured "up next" promo card (in the hero)

**What it is / why it exists:** the promo card in the hero highlights the **next
event coming up**. PowerToFly is reducing the number of summits and moving to a
smaller, more focused set of events (client events and AI events). Because there
are fewer events overall, it makes sense to spotlight **what's coming next** and
drive registrations for it, rather than list many events in the hero.

**What it shows** (for the next upcoming event): event type (eyebrow), title,
key details (date · participants · speakers · format · duration), a live
**countdown** ("Starts in Xd Xh Xm Xs"), a **Register** CTA, and a representative
image.

**Selection logic:** feature the **next event by date** — the soonest event whose
`end` datetime is still in the future. When that event ends, the card
automatically advances to the next upcoming event.
- If **no** upcoming events exist → *(to confirm)* hide the promo card, or fall
  back to a generic "browse events" state.

**Relationship to the states:** the promo card belongs to the **default state**.
While an event is **live** (AC2), the live takeover replaces the marketing hero
(and therefore this card); outside the live window the card shows the next
upcoming event.

**Register CTA routing:** same auth logic as Join live event — logged out →
registration page; logged in → the event's detail page.

---

## AC1 — Default state (no live event)
**Given** no flagship event is currently live
**Then** the events page renders its standard layout, top to bottom:
hero → featured "up next" promo card (next flagship + countdown) → companies-hiring
logo band → Upcoming events list → Past events archive → Become a Speaker CTA
**And** no live takeover and no live indicator are shown anywhere.

## AC2 — Live state (an event is live)
**Given** a flagship event's current time is between its `start` and `end`
**Then** the top of the page is replaced by a full-bleed **live takeover** for that
event (the marketing hero is hidden while live), showing:
- a **live indicator** — small pulsing red dot + eyebrow reading `Live {event type}` (e.g. "Live summit")
- the **event title**
- **key details**: date, participants, speakers, format, duration
- two CTAs: **Join live event** and **See upcoming events**

**And** the rest of the page (logo band, Upcoming, Past, Speaker CTA) still renders
below the takeover.
**And** if more than one event is live at once, the takeover shows the one whose
window is currently active and ends soonest.

## AC3 — Entering / exiting the live state
**Given** the page is open
**Then** live status is evaluated on load and re-checked on an interval, so the page
enters the live state at the event's `start` and returns to the default state at its
`end` **without requiring a manual refresh**.

## AC4 — "See upcoming events" CTA
**When** the user clicks **See upcoming events** (in the live takeover)
**Then** the page scrolls to the Upcoming events section, with the section title
landing **below** the fixed header (not hidden behind it).

## AC5 — "Join live event" CTA — logged-out visitor
**Given** the visitor is **not** authenticated on PowerToFly
**When** they click **Join live event**
**Then** they are taken to the **event's registration page**.

## AC6 — "Join live event" CTA — logged-in visitor
**Given** the visitor **is** authenticated on PowerToFly
**When** they click **Join live event**
**Then** they are taken **directly to the live event page** (the event room/stream),
**bypassing registration**.

---

## Notes / to confirm
- **Auth detection:** how the frontend determines logged-in vs logged-out
  (session cookie / auth check) needs to be specified.
- **URLs:** confirm the exact registration URL and the logged-in "go straight to
  the event" URL. In the prototype both CTAs point to a placeholder
  (`powertofly.com/browse-events`).
- **Logged-in but not registered:** confirm expected behavior — go straight in
  (auto-register), or still route to registration first. AC6 currently assumes
  logged-in ⇒ straight to the event.
- **Prototype-only:** remove the "Preview live event" dev toggle before production.
