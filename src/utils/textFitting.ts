import React, { useMemo } from 'react';

export interface FitTextOptions {
  baseFontSize?: number; // base size in px (e.g. 32)
  minFontSize?: number;  // min size in px (e.g. 14)
  charThreshold?: number; // character count before reduction begins (default 12)
  targetWidthPx?: number; // container width limit in px
  letterSpacing?: string; // base letter spacing
}

export interface FitTextStyleResult {
  fontSize: string;
  letterSpacing: string;
  lineHeight: string;
  whiteSpace: 'nowrap';
  overflow: 'hidden';
  textOverflow: 'ellipsis';
}

/**
 * fitTextToBox()
 * Pure television broadcast typography scaling utility.
 * Calculates exact font size, letter spacing and line height so text
 * never overflows or clips its designated container, while KEEPING
 * the container, row height, and visual design 100% fixed and stable.
 */
export function fitTextToBox(
  text: string,
  options: FitTextOptions = {}
): FitTextStyleResult {
  const {
    baseFontSize = 32,
    minFontSize = 14,
    charThreshold = 14,
    targetWidthPx,
    letterSpacing = '0.02em',
  } = options;

  const cleanText = text || '';
  const length = cleanText.length;

  let computedSize = baseFontSize;
  let computedTracking = letterSpacing;

  if (length > charThreshold) {
    // If targetWidthPx is supplied, use pixel density estimation
    // Average uppercase char width ~= 0.62 * fontSize
    if (targetWidthPx) {
      const estimatedCharWidthFactor = 0.62;
      const idealFontSize = targetWidthPx / (length * estimatedCharWidthFactor);
      computedSize = Math.max(minFontSize, Math.min(baseFontSize, Math.round(idealFontSize)));
    } else {
      // Step-based broadcast curve
      const excess = length - charThreshold;
      const reductionRatio = Math.max(0.45, 1 - excess * 0.032);
      computedSize = Math.max(minFontSize, Math.round(baseFontSize * reductionRatio));
    }

    // Tighten letter spacing for longer text to preserve legibility without breaking boundaries
    if (computedSize < baseFontSize * 0.8) {
      computedTracking = '-0.015em';
    } else if (computedSize < baseFontSize * 0.9) {
      computedTracking = '0em';
    }
  }

  return {
    fontSize: `${computedSize}px`,
    letterSpacing: computedTracking,
    lineHeight: '1.05',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
}

/**
 * FitText Component
 * Wrapper component to automatically apply fitted typography to any broadcast text
 */
export const FitText: React.FC<{
  text: string;
  baseFontSize?: number;
  minFontSize?: number;
  charThreshold?: number;
  targetWidthPx?: number;
  className?: string;
  as?: React.ElementType;
  title?: string;
}> = ({
  text,
  baseFontSize = 32,
  minFontSize = 14,
  charThreshold = 14,
  targetWidthPx,
  className = '',
  as: Component = 'span',
  title,
}) => {
  const style = useMemo(() => {
    return fitTextToBox(text, {
      baseFontSize,
      minFontSize,
      charThreshold,
      targetWidthPx,
    });
  }, [text, baseFontSize, minFontSize, charThreshold, targetWidthPx]);

  return React.createElement(
    Component,
    {
      style,
      className: `block select-none ${className}`,
      title: title || text,
    },
    text
  );
};

/**
 * calculateTextWrapping()
 * Intelligent television broadcast text wrapping for artist names and titles.
 * Splits text into 1 or 2 lines at logical boundaries (spaces, 'FT.', '&')
 * so text never overflows or clips.
 */
export function calculateTextWrapping(
  text: string,
  maxCharsPerLine: number = 16
): { lines: string[]; isMultiLine: boolean } {
  const clean = (text || '').trim();
  if (!clean) return { lines: [''], isMultiLine: false };

  if (clean.length <= maxCharsPerLine) {
    return { lines: [clean], isMultiLine: false };
  }

  // Look for feature delimiter first (e.g. "FT." or "FEAT.")
  const ftRegex = /\s+(ft\.|feat\.|&)\s+/i;
  const ftMatch = clean.match(ftRegex);
  if (ftMatch && ftMatch.index !== undefined) {
    const part1 = clean.substring(0, ftMatch.index).trim();
    const part2 = clean.substring(ftMatch.index).trim();
    return { lines: [part1, part2], isMultiLine: true };
  }

  // Split by words and find the closest balance point to middle
  const words = clean.split(/\s+/);
  if (words.length <= 1) {
    return { lines: [clean], isMultiLine: false };
  }

  const targetMid = Math.floor(clean.length / 2);
  let bestIndex = 1;
  let bestDiff = Infinity;
  let currentLen = 0;

  for (let i = 0; i < words.length - 1; i++) {
    currentLen += words[i].length + (i > 0 ? 1 : 0);
    const diff = Math.abs(currentLen - targetMid);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i + 1;
    }
  }

  const line1 = words.slice(0, bestIndex).join(' ');
  const line2 = words.slice(bestIndex).join(' ');

  return { lines: [line1, line2], isMultiLine: true };
}

export interface IdentifierLayoutResult {
  lines: string[];
  isMultiLine: boolean;
  fontSize: number;
  lineHeight: number;
  letterSpacing: string;
}

/**
 * calculateIdentifierLineBreaks()
 * Dedicated broadcast layout engine for Performance Identifier.
 * Dynamically computes 1-line or 2-line rendering:
 * - Single-word artists (e.g. ASHA, MELODY) -> 1 line with dominant typography
 * - Artists with collaboration (FT., FEAT., &, Y) -> 2 lines
 * - Multi-word artists -> intelligently breaks into 2 lines to preserve large, bold readability
 *   without clipping or excessive shrinking.
 */
export function calculateIdentifierLineBreaks(
  rawArtist: string,
  availableWidth: number = 440
): IdentifierLayoutResult {
  const clean = (rawArtist || '').trim().replace(/\s+/g, ' ');
  if (!clean) {
    return {
      lines: [''],
      isMultiLine: false,
      fontSize: 34,
      lineHeight: 1.05,
      letterSpacing: '0.04em',
    };
  }

  // 1. Single word (no space)
  if (!clean.includes(' ')) {
    const fontSize = clean.length > 10 ? Math.max(22, Math.round(36 * (10 / clean.length))) : 36;
    return {
      lines: [clean],
      isMultiLine: false,
      fontSize,
      lineHeight: 1.05,
      letterSpacing: '0.05em',
    };
  }

  // 2. Collaboration or feature marker (FT., FEAT., &, Y, X)
  const ftRegex = /\s+(ft\.|feat\.|&|\+|y|x)\s+/i;
  const ftMatch = clean.match(ftRegex);
  if (ftMatch && ftMatch.index !== undefined) {
    const line1 = clean.substring(0, ftMatch.index).trim();
    const line2 = clean.substring(ftMatch.index).trim();
    const maxLine = Math.max(line1.length, line2.length);
    const fontSize = maxLine > 14 ? Math.max(20, Math.round(32 * (14 / maxLine))) : 30;
    return {
      lines: [line1, line2],
      isMultiLine: true,
      fontSize,
      lineHeight: 1.1,
      letterSpacing: '0.04em',
    };
  }

  // 3. Names with spaces: if >= 10 chars or width exceeds single-line budget, break into 2 lines
  const estSingleLineWidth = clean.length * 20;
  if (clean.length >= 10 || estSingleLineWidth > availableWidth) {
    const words = clean.split(' ');
    const mid = Math.floor(clean.length / 2);
    let bestIndex = 1;
    let minDiff = Infinity;
    let running = 0;
    for (let i = 0; i < words.length - 1; i++) {
      running += words[i].length + (i > 0 ? 1 : 0);
      const diff = Math.abs(running - mid);
      if (diff < minDiff) {
        minDiff = diff;
        bestIndex = i + 1;
      }
    }
    const line1 = words.slice(0, bestIndex).join(' ');
    const line2 = words.slice(bestIndex).join(' ');
    const maxLine = Math.max(line1.length, line2.length);
    const fontSize = maxLine > 14 ? Math.max(22, Math.round(32 * (14 / maxLine))) : 32;
    return {
      lines: [line1, line2],
      isMultiLine: true,
      fontSize,
      lineHeight: 1.12,
      letterSpacing: '0.04em',
    };
  }

  // 4. Compact 2-word artist fitting easily on 1 line
  return {
    lines: [clean],
    isMultiLine: false,
    fontSize: 34,
    lineHeight: 1.05,
    letterSpacing: '0.05em',
  };
}

