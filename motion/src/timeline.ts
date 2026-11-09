/**
 * Concept A, "signal trace", in seconds. The signal square travels the S at
 * constant speed (a signal does not accelerate), is routed to the foot of the
 * i, climbs the stem, and decelerates only on arrival, where it becomes the dot.
 */
export type Timeline = {
  /** Signal square appears at the start of the S. */
  appear: number;
  /** The S is traced from `appear` to here. */
  sEnd: number;
  /** The signal reappears at the foot of the i. */
  stemStart: number;
  /** The stem is traced from `stemStart` to here. */
  stemEnd: number;
  /** The signal settles into the dot's exact position. From here on, the mark is the static logo. */
  lock: number;
  /** The mark starts moving from the centre into the lockup. */
  slide: number;
  /** The slide ends; it is deliberately slow and eased in and out. */
  slideEnd: number;
  /** The first letter of the name starts to appear. */
  wordmark: number;
  /** Delay between two letters. */
  letterStagger: number;
  /** How long one letter takes to come into focus. */
  letterDuration: number;
  /** Total length; the end must leave at least 1.5 s of static logo. */
  total: number;
};

export const defaultTimeline: Timeline = {
  appear: 0.3,
  sEnd: 1.45,
  stemStart: 1.55,
  stemEnd: 1.8,
  lock: 2.2,
  slide: 2.25,
  slideEnd: 3.6,
  wordmark: 2.45,
  letterStagger: 0.065,
  letterDuration: 0.9,
  total: 5.6,
};

export const FPS = 60;
