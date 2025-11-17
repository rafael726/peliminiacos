# Design Guidelines: Movie Streaming Platform

## Design Approach
**Reference-Based Design** inspired by Netflix, Disney+, and HBO Max streaming platforms. Focus on cinematic presentation, content discovery, and seamless browsing experience.

## Typography System
- **Primary Font**: Inter or Manrope (via Google Fonts CDN)
- **Display Font**: Bebas Neue or Oswald for dramatic movie titles
- **Hierarchy**:
  - Hero titles: 4xl to 6xl, bold weight
  - Section headers: 2xl to 3xl, semibold
  - Movie titles: lg to xl, medium weight
  - Body/metadata: sm to base, regular weight
  - Labels/tags: xs to sm, medium weight, uppercase with letter-spacing

## Layout & Spacing System
- **Container**: max-w-7xl with px-4 to px-8
- **Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-6, my-12)
- **Section Padding**: py-12 to py-24 for vertical breathing room
- **Grid Gaps**: gap-4 to gap-6 for movie cards, gap-2 for metadata

## Core Layout Structure

### Navigation
- Fixed top navbar with logo left, search center, user profile/favorites right
- Height: h-16 to h-20
- Sticky positioning with backdrop blur effect
- Categories/genres as horizontal scrollable nav beneath main header

### Hero Section
- Full-width cinematic banner: h-[70vh] to h-[85vh]
- Featured movie with large backdrop image
- Gradient overlay from transparent to solid at bottom
- Content positioned bottom-left with max-w-2xl
- Primary CTA buttons: "Play" and "Add to Favorites" with backdrop blur (backdrop-blur-md bg-white/20)
- Movie metadata in compact row: duration, year, classification badges

### Movie Catalog Sections
- Multiple themed sections: "Popular Now", "Recently Added", "Action Movies", "By Genre"
- Each section: mb-12 to mb-16 spacing
- Section header with "See All" link aligned right
- Horizontal scrollable rows for discovery (overflow-x-auto snap-x)
- Grid view option for browse pages (grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5)

### Movie Cards
- Aspect ratio: aspect-[2/3] for poster style
- Rounded corners: rounded-md to rounded-lg
- Hover transform: scale-105 with transition-transform duration-300
- Image placeholder with movie poster
- Overlay on hover showing: title, genre tags, duration, year
- Quick action buttons on hover: "Add to Favorites" heart icon, "Info" icon

### Movie Detail Page
- Hero section with backdrop image: h-[60vh]
- Two-column layout below hero:
  - Left: Poster image (w-64 to w-80)
  - Right: Title, metadata, synopsis, cast, director
- Action buttons row: "Play", "Add to Favorites", "Share"
- Related movies section at bottom

### Search & Filters
- Prominent search bar in hero or sticky header
- Filter sidebar (lg:w-64) or modal on mobile with:
  - Genre checkboxes (grid-cols-2)
  - Year range slider
  - Classification dropdown
  - Duration filter
- Results grid: same as catalog grid

### User Profile/Favorites
- Profile header with user stats (total favorites, hours watched)
- Tabbed interface: "My Favorites", "Watch History", "Statistics"
- Empty state illustrations when no favorites exist
- Favorites grid matching catalog layout

## Component Library

### Buttons
- Primary: px-6 py-3, rounded-lg, font-medium
- Secondary: px-4 py-2, rounded-md
- Icon buttons: p-2 to p-3, rounded-full
- Buttons on images: backdrop-blur-md with semi-transparent background

### Badges
- Genre tags: px-3 py-1, rounded-full, text-xs uppercase
- Classification: px-2 py-1, rounded border
- Duration/year: inline-flex items-center gap-1

### Cards
- Movie card: rounded-lg, overflow-hidden, shadow-lg on hover
- Info card: p-4 to p-6, rounded-xl

### Forms
- Input fields: h-12, px-4, rounded-lg
- Search input: w-full max-w-xl with search icon
- Form spacing: space-y-4

### Icons
Use Heroicons via CDN for: search, heart, play, user, film, star, clock, calendar, filter, x-mark

## Page-Specific Layouts

### Home Page
1. Hero with featured movie (85vh)
2. Popular movies horizontal scroll
3. Recently added grid section
4. Genre-based sections (3-4 categories)
5. Footer with links and info

### Browse/Catalog Page
- Filter sidebar (desktop) or top filters (mobile)
- Pagination at bottom
- Grid: grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6

### Search Results
- Search bar sticky at top
- Active filters display with remove option
- Results count header
- Same grid layout as catalog

## Images
**Required Images:**
- Hero backdrop: 1920x1080 cinematic movie scenes (3-5 featured movies)
- Movie posters: 500x750 for each movie card (use placeholder service initially)
- User avatars: 80x80 circular
- Empty state illustrations: 400x300 for no favorites/results

**Hero Image**: Yes - full-width cinematic backdrop with featured movie, gradient overlay, CTA buttons with backdrop blur

## Animations
- Minimal and purposeful only
- Card hover scale: scale-105 with 300ms transition
- Fade-in for image loading
- Smooth scroll for horizontal carousels
- No page transitions or excessive motion