# Motion and performance system

## Opening gate

On the first page, wheel, touch, and navigation-key scrolling are briefly locked while the five course labels resolve. The lock is removed automatically when the intro timeline completes. Reduced-motion mode displays the content immediately.

## Scroll camera

Desktop scenes use small `translateZ`, `rotateX`, scale, and Y-axis changes tied to scroll progress. No WebGL scene is required, and mobile skips the 3D transforms entirely.

## Single animation owner

GSAP and ScrollTrigger now control all entrances and scroll motion. The previous Framer Motion dependency was removed so two libraries no longer write conflicting transforms to the same typography.

## Rendering choices

- No animated noise texture
- No continuously animated giant blur filters
- No pinned opening sequence
- No blur-to-focus animation on body paragraphs
- Fixed atmosphere layers move by transform only
- Pointer light moves as one composited element
- Route transitions use translated panels instead of complex clip paths

## Typography safety

Large text has increased line-height, explicit top/bottom padding, visible overflow, and non-clipping split-word wrappers. This protects ascenders, descenders, italics, punctuation, and glow effects.

## Soundtrack

The player targets local licensed files in `public/audio/` and can also load local browser files. Music is never autoplayed because browsers require a user gesture and copyrighted audio is not included.
