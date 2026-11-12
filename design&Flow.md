Design system: Strictly monochrome, black and white only, no color accents. Premium glassmorphism in the spirit of Apple visionOS and Linear. Dark and light themes share the same structure.

Dark theme: Background 
#050505 with a few large, very soft, blurred white-gray light orbs (5-8% opacity) positioned behind the content to give the glass something to refract. Glass surfaces: rgba(255,255,255,0.05) fill, 24px backdrop blur, 1px border rgba(255,255,255,0.10), plus a faint 1px inner top highlight rgba(255,255,255,0.15). Text: white 95% for headings, 60% secondary, 40% tertiary. Primary button: solid white with black text.

Light theme: Background 
#F2F2F3 with soft blurred gray-white orbs. Glass surfaces: rgba(255,255,255,0.55) fill, 24px backdrop blur, 1px border rgba(0,0,0,0.08), soft shadow 0 8px 32px rgba(0,0,0,0.06). Text: black 92% / 60% / 40%. Primary button: solid black with white text.

Typography: Inter for UI, JetBrains Mono for prices, specs and technical text. 20px card radius, 12px inputs and buttons, 8px spacing grid. No gradients with color, no neon, no glow. Hierarchy comes from opacity, blur depth and layering. Status is shown with monochrome icons and labels, not colors (an optional tiny muted dot is fine).


User-Flow

AnyLink User Flow

Your core rule is that the URL is the only way to add a part, so there is no search step. The “searching” stage is the scanning state after a URL is pasted, and that is how the prompts below treat it.

Flow map
Landing → Auth choice (Log in / Sign up / Continue as guest)
   ↓
Empty dashboard (first-time guide)
   ↓
Select a slot (e.g. GPU) or leave on Auto-detect
   ↓
Paste URL → Scanning → Review modal → Added to build
   ↓                ↘ Error (retry / enter manually)
Repeat for each part (compatibility checks update live)
   ↓
Export build → Choose format → Download / Copy share link
   ↓
Guest only: "Save your build" nudge → Sign up

Design decisions to lock in:

Guests get the full builder. The build is stored in the browser. Login is only needed to save across devices and get a shareable link. This removes friction at the first step.
Auth options: Email, Google, and magic link (all supported by Supabase).
Shared design system: paste your monochrome glass design system from the previous message at the start of every prompt below, shown here as [design system].
Flow 1: Landing and auth choice

[design system]
Design a minimal desktop landing screen for “AnyLink”, a PC part picker where you add parts by pasting any store link. Centered hero over a soft blurred monochrome background: logo, headline “Build your PC from any store.”, subtext “Paste a link. We do the rest.” Below it, a large frosted-glass URL input as a non-functional preview, with a faint animated example link. Three clear entry actions in a glass card: solid white “Continue as guest” (primary), “Log in” (ghost), “Create account” (ghost). Small text under it: “No account needed to start. Sign up later to save and share.” Top right: sun/moon theme toggle. Dark theme. Calm, confident, premium.

Flow 2: Log in and sign up

[design system]
Design a centered frosted-glass auth card over the blurred background, with a segmented tab switch “Log in | Sign up”. Contents: “Continue with Google” button, a divider “or”, an email input, a password input with show/hide icon, and a solid white primary button (“Log in” or “Create account”). Below it, a text link “Email me a magic link instead”, and at the very bottom a subtle “Continue as guest” link with an arrow. Show the Log in tab active, with a small “Forgot password?” link. Dark theme. Monochrome only, no colored buttons.

Follow-up prompt for the Sign up variant:

Same card with the Sign up tab active. Add a name field and a small line “Your guest build will be saved to your account” with a checkmark icon.

Flow 3: Empty dashboard (first-time guide)

[design system]
Design the dashboard when a new user lands with an empty build. Two-column layout as before. Left: sticky glass control panel with the large URL input highlighted by a stronger border, and a subtle one-time tooltip pointing at it: “Paste a product link from Amazon, Newegg or any local shop.” Total price shows “$0.00”, “0 of 9 components”, compatibility chip “Nothing to check yet”. Right: all component slots (CPU, Cooler, Motherboard, Memory, Storage, GPU, PSU, Case, Fans) as dashed translucent cards, each with a thin line icon and “Paste a link to add”. Top bar: logo, “Guest” avatar chip with a “Save build” ghost button, theme toggle. Dark theme.

Flow 4: Select a component category

[design system]
Design the state where the user clicks the empty GPU slot. The GPU card is highlighted with a stronger border and slightly lifted, and the left panel’s category dropdown automatically changes from “Auto-detect” to “GPU” with a small linked-state animation hint. The URL input placeholder updates to “Paste a GPU link…”. Show a small hint below the input: “Tip: leave on Auto-detect and we’ll figure out the category.” Other slots dim slightly. Also show the open category dropdown as a glass popover with icons: Auto-detect, CPU, Cooler, Motherboard, Memory, Storage, GPU, PSU, Case.

Flow 5: Paste the URL

[design system]
Design the moment right after a link is pasted into the hero input. The input now shows a long product URL truncated in the middle, a store favicon and domain pill (“newegg.com”) appearing at its left, and a clear (x) icon. The “Analyze” button becomes active (solid white, previously disabled ghost). Under the input, a small line “Store recognized · Category: GPU”. Show a subtle inline validation row in monochrome with a checkmark icon. Keep everything else on the dashboard unchanged.

Flow 6: Scanning (the “searching” state)

[design system]
Design the loading state inside the left glass panel after “Analyze” is pressed. Show the pasted URL in a glass pill, a slim white progress line with a soft shimmer, and a 3-step checklist in monospaced text: “Fetching page ✓”, “Reading product details” (in progress, with a small spinner), “Extracting specs” (pending). On the right, the target GPU slot turns into a skeleton glass card with a gentle shimmer sweep. A small “Cancel” text button below. Understated, no flashy effects.

Flow 7: Review and verify

[design system]
Design a floating frosted-glass modal titled “Review component” over a heavily blurred, dimmed dashboard. Left: a 160px product image with a source badge (favicon and domain). Right: editable product name, category selector, a large price input in monospaced type with a currency selector, and a note “Extracted by AI, please verify” with an info icon. Spec chips below (e.g. “12GB GDDR6X”, “305 mm”, “PCIe 4.0”). One low-confidence field has a dashed outline and a “Check this” label. Footer: ghost “Cancel” and solid white “Add to build”.

Flow 8: Added to build

[design system]
Design the dashboard right after a component is added. The GPU slot is now a filled glass card: 64px thumbnail, product name, spec chips, store favicon and domain, price right-aligned in mono, and hover-revealed edit and remove icons. The card has a brief “just added” state, a subtle brighter border and a small checkmark badge. A glass toast at the bottom center: “GPU added · Undo”. The left panel total price has updated to $799.99 with a small “+ $799.99” delta label, the count shows “1 of 9”, and the compatibility chip reads “Looking good”. The URL input has cleared and is ready for the next link.

Flow 9: Error state

[design system]
Design an inline glass error card in the left panel: “We couldn’t read this page.” with a monochrome warning icon and a short explanation (“The store may be blocking access, or this isn’t a product page.”). Actions: solid “Try again” and ghost “Enter details manually”. The pasted URL stays visible in a pill above, with an edit icon. Slightly stronger border instead of any red tint.

Flow 10: Compatibility warning (mid-build)

[design system]
Design the dashboard with a populated build (CPU, Motherboard, Memory, GPU, PSU filled). Show a compatibility panel in the left column as an expandable glass card: header “2 things to check” with a chevron. Expanded rows with monochrome icons: “PSU 550W may be underpowered for this GPU (recommended 750W)” and “GPU length 305 mm, confirm case clearance”. Each row has a “View part” ghost link that scrolls to the related slot. The affected slots on the right show a small warning icon at their corner.

Flow 11: Export build

[design system]
Design an “Export build” modal as a floating frosted-glass sheet. Left: a live preview of the build summary as a small glass document (build name, parts list with prices, total). Right: a vertical list of export options as glass rows with line icons: “Share link”, “PDF”, “Spreadsheet (CSV)”, “Image for social”, “Copy as text”. The Share link row is marked “Account required” with a lock icon for guests. Build name is an editable field at the top. Footer: ghost “Cancel” and solid white “Export”.

Flow 12: Download and share confirmation

[design system]
Design the success state after export. The modal content swaps to a confirmation: large thin-line checkmark, “Your build is ready”, the file name “My-Dream-Rig.pdf” with file size and a solid white “Download again” button. Below it, a share section with a read-only glass input holding “anylink.app/b/x7k2m9” and a “Copy link” button that shows a “Copied ✓” state. Secondary row: ghost buttons “Export another format” and “Back to build”.

Follow-up prompt for the actual PDF design:

Design a clean A4 printable PDF of the PC build in light theme only (black text on white, no glass). Header with logo and build name, a table with part category, product name, store, and price in mono, a total line, and a footer “Prices captured on [date] from the linked stores” with small clickable store links per row.

Flow 13: Guest save nudge

[design system]
Design a gentle, non-blocking glass banner that appears at the bottom of the dashboard for a guest with 4+ parts added: “Don’t lose your build. Save it to an account.” with a solid white “Save build” button and a small dismiss (x). Also design the follow-up compact modal when clicked: “Create a free account” with Google, email, and a note “Your current build will be kept.”

Flow 14: Mobile version (the key screens)

[design system]
Design the mobile version of the dashboard (390px wide). Top bar: logo, theme toggle, avatar. Main area: scrollable list of component glass cards. Bottom: a pinned frosted-glass bar containing the URL input (“Paste a product link…”), a paste icon button, and a compact total price chip. Tapping Analyze opens a bottom sheet for the scanning state, then the review sheet slides up as a bottom sheet instead of a modal.