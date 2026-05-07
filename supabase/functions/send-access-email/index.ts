import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Drive links (each product MUST have its own secret — no shared fallback) ──
const LINKS = {
  sketchup: Deno.env.get('DRIVE_LINK_SKETCHUP') ?? '',
  render:   Deno.env.get('DRIVE_LINK_RENDER')   ?? '',
  full:     Deno.env.get('DRIVE_LINK_FULL')     ?? '',
  books:    Deno.env.get('DRIVE_LINK_BOOKS')    ?? '',
  booksDownsell: Deno.env.get('DRIVE_LINK_BOOKS_DOWNSELL') ?? '',
};

// ── Buy links ──
const BUY = {
  renders:    'https://start.avadalearn.com/',
  fullBundle: 'https://start.avadalearn.com/onetime',
  books:      'https://start.avadalearn.com/offer',
  checkout:   'https://start.avadalearn.com/checkout',
};

// ─────────────────────────────────────────────
// SHARED HTML HELPERS
// ─────────────────────────────────────────────

function wrap(body: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f5;font-family:system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
${body}
<tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
<p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 Avada Design. You received this because you signed up for a free resource.<br>
<a href="https://start.avadalearn.com" style="color:#9ca3af;">Visit us</a> · <a href="mailto:hello@archbysha.com?subject=Unsubscribe" style="color:#9ca3af;">Unsubscribe</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

const hdr = (title: string, sub: string, color = '#000000') =>
  `<tr><td style="background:${color};padding:32px 40px;">
<p style="margin:0;color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">AVADA DESIGN</p>
<h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:900;line-height:1.2;">${title}</h1>
<p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:14px;">${sub}</p>
</td></tr>`;

const accessBtn = (link: string, label: string) =>
  `<a href="${link}" style="display:inline-block;background:#000;color:#fff;font-weight:700;font-size:15px;padding:14px 28px;border-radius:8px;text-decoration:none;margin-top:16px;">${label} →</a>`;

const buyBtn = (link: string, label: string, price: string) =>
  `<a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">${label} — ${price} →</a>`;

const divider = () =>
  `<tr><td style="padding:0 40px;"><div style="border-top:1px solid #e5e7eb;"></div></td></tr>`;

const whatsapp = () =>
  `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;">
<tr><td style="padding:18px 22px;">
<p style="margin:0 0 12px;color:#166534;font-size:13px;font-weight:700;">Need help? We're here 24/7.</p>
<a href="https://wa.me/919198747810" style="display:inline-block;background:#25D366;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">💬 Chat on WhatsApp</a>
</td></tr></table>`;

// "You're missing" upsell block
const missBox = (items: { emoji: string; title: string; desc: string; price: string; link: string }[]) => {
  const rows = items.map(i => `
    <tr><td style="padding:18px 22px;border-bottom:1px solid #fed7aa;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:top;width:36px;font-size:24px;">${i.emoji}</td>
        <td style="vertical-align:top;padding-left:10px;">
          <p style="margin:0 0 4px;font-weight:700;font-size:15px;color:#1e293b;">${i.title}</p>
          <p style="margin:0 0 12px;font-size:13px;color:#64748b;line-height:1.6;">${i.desc}</p>
          ${buyBtn(i.link, 'Add This', i.price)}
        </td>
      </tr></table>
    </td></tr>`).join('');

  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:2px solid #fed7aa;border-radius:12px;overflow:hidden;margin-bottom:24px;">
<tr><td style="background:#f97316;padding:12px 22px;">
  <p style="margin:0;color:#fff;font-size:13px;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;">⬇️ Don't leave without these</p>
</td></tr>
${rows}
</table>`;
};

// ─────────────────────────────────────────────
// TEMPLATES
// ─────────────────────────────────────────────

function getGreeting(name?: string | null): string {
  if (!name) return 'Hi there,';
  const firstName = name.split(' ')[0];
  return `Hi ${firstName},`;
}

// ─────────────────────────────────────────────

function tSketchupFree(name?: string | null, c = '$'): { subject: string; html: string } {
  return {
    subject: 'Your Courses are Here - SketchUp Access',
    html: wrap(`
      ${hdr('Your SketchUp course is live!', '100% free — yours to keep forever.')}
      <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px;color:#374151;font-size:16px;font-weight:600;">${getGreeting(name)}</p>
        <p style="margin:0 0 8px;color:#374151;font-size:16px;line-height:1.7;">Your <strong>SketchUp Absolute Beginner to Pro</strong> course is now ready. This is your permanent access link — bookmark it!</p>
        ${accessBtn(LINKS.sketchup, 'Open Your Free SketchUp Course')}
        <br/><br/>
        <p style="margin:0 0 20px;color:#64748b;font-size:13px;line-height:1.6;">💡 <em>Tip: Start with Module 1 — Interface & Navigation. Most students complete it in an afternoon.</em></p>
      </td></tr>
      ${divider()}
      <tr><td style="padding:32px 40px 0;">
        <p style="margin:0 0 4px;color:#f97316;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">⚡ Your Next Step</p>
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0f172a;">SketchUp only makes the wireframe.</h2>
        <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.7;">
          Clients don't pay for wireframes. They pay for <strong>photorealistic images</strong> and <strong>cinematic video walkthroughs</strong>. That's V-Ray AI and D5 Render AI — and designers with these skills charge <strong>${c}2,000–${c}5,000 per project</strong>.
        </p>
      </td></tr>
      <tr><td style="padding:0 40px 36px;">
        ${missBox([
          {
            emoji: '⚡',
            title: 'V-Ray AI + D5 Render AI',
            desc: 'Generate photorealistic renders and 4K video walkthroughs using AI. The #1 skill gap between designers who get ${c}200 Fiverr gigs vs ${c}3,000 studio projects.',
            price: '${c}9 one-time',
            link: BUY.renders,
          },
          {
            emoji: '🏆',
            title: 'Complete 9-Course Bundle',
            desc: 'AutoCAD, Revit, Lumion, 3ds Max, Enscape VR, Photoshop & more. Everything a top-tier designer needs in one library.',
            price: '${c}27 one-time',
            link: BUY.fullBundle,
          },
          {
            emoji: '📚',
            title: '6 Interior Design Books',
            desc: 'Space Planning, Materials, Lighting, Kitchen & Bedroom Design. Pro reference books used in real design firms.',
            price: '${c}36 one-time',
            link: BUY.books,
          },
        ])}
        ${whatsapp()}
      </td></tr>`),
  };
}

function tRenderBundle(name?: string | null, c = '$'): { subject: string; html: string } {
  return {
    subject: 'Your Courses are Here - V-Ray & D5 Render Access',
    html: wrap(`
      ${hdr("Your rendering library is unlocked.", "V-Ray AI + D5 Render AI — yours for life.", '#1e293b')}
      <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px;color:#374151;font-size:16px;font-weight:600;">${getGreeting(name)}</p>
        <p style="margin:0 0 8px;color:#374151;font-size:16px;line-height:1.7;">You now have the rendering skills that <strong>95% of designers are still missing</strong>. Here's your library:</p>
        <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:2;">✅ SketchUp Pro<br/>✅ V-Ray AI — Photorealistic rendering<br/>✅ D5 Render AI — Real-time 4K walkthroughs</p>
        ${accessBtn(LINKS.render, 'Open Your Rendering Courses')}
        <br/><br/>
        <p style="margin:0 0 0;color:#64748b;font-size:13px;line-height:1.6;">💡 <em>Start with V-Ray — Module 1 covers AI lighting in under 2 hours. You'll render your first scene today.</em></p>
      </td></tr>
      ${divider()}
      <tr><td style="padding:32px 40px 0;">
        <p style="margin:0 0 4px;color:#f97316;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">⬆️ Complete Your Stack</p>
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0f172a;">You're still missing the tools at the top of every job listing.</h2>
        <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.7;">
          AutoCAD, Revit, Lumion and 3ds Max appear in <strong>87% of architecture job postings</strong>. Don't let a skill gap cost you your next project or role.
        </p>
      </td></tr>
      <tr><td style="padding:0 40px 36px;">
        ${missBox([
          {
            emoji: '🏆',
            title: 'Complete 9-Course Bundle',
            desc: 'AutoCAD 2D/3D, Revit Architecture, Lumion Visualization, 3ds Max + Corona, Enscape VR, Photoshop, Illustrator, SketchUp Advanced Interiors, AI Tools for Design.',
            price: '${c}27 one-time',
            link: BUY.fullBundle,
          },
          {
            emoji: '📚',
            title: '6 Interior Design Books',
            desc: 'Space Planning, Materials & Textures, Lighting Design, Kitchen Interiors, Bedroom Design, Commercial Spaces. Reference books used by working professionals.',
            price: '${c}36 one-time',
            link: BUY.books,
          },
        ])}
        ${whatsapp()}
      </td></tr>`),
  };
}

function tFullBundle(name?: string | null, c = '$'): { subject: string; html: string } {
  return {
    subject: 'Your Courses are Here - Complete Library Access',
    html: wrap(`
      ${hdr("Welcome to the full Avada library.", "All 12 premium courses — yours for life.", '#0c4a6e')}
      <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px;color:#374151;font-size:16px;font-weight:600;">${getGreeting(name)}</p>
        <p style="margin:0 0 8px;color:#374151;font-size:16px;line-height:1.7;">Here's your complete library — everything you need to go from student to studio-level professional:</p>
        <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:2;">
          ✅ SketchUp Pro<br/>✅ V-Ray AI<br/>✅ D5 Render AI<br/>✅ AutoCAD 2D & 3D<br/>✅ Revit Architecture<br/>✅ Lumion Visualization<br/>✅ 3ds Max + Corona<br/>✅ Enscape VR<br/>✅ Photoshop for Designers<br/>✅ Adobe Illustrator<br/>✅ SketchUp Advanced Interiors<br/>✅ AI Tools for Design
        </p>
        ${accessBtn(LINKS.full, 'Open Your Full Course Library')}
      </td></tr>
      ${divider()}
      <tr><td style="padding:32px 40px 0;">
        <p style="margin:0 0 4px;color:#f97316;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">📚 One Last Piece</p>
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0f172a;">Great designers don't just know software. They know design principles.</h2>
        <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.7;">
          These 6 professional books cover Space Planning, Materials, Lighting, and specialist rooms. They're the reference library that separates a <em>technician</em> from a <em>true designer</em>.
        </p>
      </td></tr>
      <tr><td style="padding:0 40px 36px;">
        ${missBox([
          {
            emoji: '📚',
            title: '6 Interior Design Books',
            desc: 'Space Planning Fundamentals, Materials & Textures, Lighting Design, The Kitchen Design Bible, Bedroom Interiors Pro, Commercial Interior Spaces. Used by design firms worldwide.',
            price: '${c}36 one-time',
            link: BUY.books,
          },
        ])}
        ${whatsapp()}
      </td></tr>`),
  };
}

function tBooks(name?: string | null, c = '$'): { subject: string; html: string } {
  return {
    subject: 'Your Interior Design Books are Ready',
    html: wrap(`
      ${hdr("Your books are ready for download.", "The 6 books used by real professionals.", '#065f46')}
      <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px;color:#374151;font-size:16px;font-weight:600;">${getGreeting(name)}</p>
        <p style="margin:0 0 12px;color:#374151;font-size:16px;line-height:1.7;">Your 6 premium interior design reference books are ready below.</p>
        ${accessBtn(LINKS.books, 'Download 6 Books →')}
        <br/><br/>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;margin-top:24px;">
          <tr><td style="padding:22px 26px;">
            <p style="margin:0 0 4px;color:#1e40af;font-weight:700;font-size:14px;">🎓 Pro Tip</p>
            <p style="margin:0;color:#1e3a8a;font-size:13px;line-height:1.7;">Keep the Space Planning Fundamentals book open when working on your SketchUp projects!</p>
          </td></tr>
        </table>
        <br/>
        ${whatsapp()}
      </td></tr>`),
  };
}

function tDownsell(name?: string | null, c = '$'): { subject: string; html: string } {
  return {
    subject: 'Your Books are Here - Access Inside',
    html: wrap(`
      ${hdr('Your 2 design books are live!', 'Kitchen Design + Bedroom Interiors — yours forever.')}
      <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px;color:#374151;font-size:16px;font-weight:600;">${getGreeting(name)}</p>
        <p style="margin:0 0 8px;color:#374151;font-size:16px;line-height:1.7;">Great choice! Your 2 bestselling books are now ready to download.</p>
        <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:2;">✅ Kitchen Design Mastery<br/>✅ Bedroom Interiors Pro</p>
        ${accessBtn(LINKS.booksDownsell, 'Download Your 2 Books')}
      </td></tr>
      ${divider()}
      <tr><td style="padding:32px 40px 0;">
        <p style="margin:0 0 4px;color:#f97316;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">⬆️ You're Missing 4 More Books & 12 Courses</p>
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:900;color:#0f172a;">Complete your professional library.</h2>
        <p style="margin:0 0 20px;color:#374151;font-size:14px;line-height:1.7;">
          The other 4 books cover <strong>Space Planning, Materials, Lighting</strong> and <strong>Commercial Interiors</strong> — the areas clients ask about most in real projects.
        </p>
      </td></tr>
      <tr><td style="padding:0 40px 36px;">
        ${missBox([
          {
            emoji: '📖',
            title: '4 More Design Books',
            desc: 'Space Planning Fundamentals, Materials & Textures, Lighting Design, Commercial Interior Spaces. Reply to this email or WhatsApp us for a special upgrade link.',
            price: '${c}24 upgrade',
            link: 'https://wa.me/919198747810',
          },
          {
            emoji: '⚡',
            title: 'V-Ray AI + D5 Render AI',
            desc: 'The rendering skills that win ${c}2,000–${c}5,000 projects. Books get you the theory — these courses make it real.',
            price: '${c}9 one-time',
            link: BUY.renders,
          },
          {
            emoji: '🏆',
            title: 'Complete 12-Course Bundle',
            desc: 'SketchUp, V-Ray, D5 Render, AutoCAD, Revit, Lumion, 3ds Max, Enscape VR and more.',
            price: '${c}27 one-time',
            link: BUY.checkout,
          },
        ])}
        ${whatsapp()}
      </td></tr>`),
  };
}

// ─────────────────────────────────────────────
// FOLLOW-UP TEMPLATES
// ─────────────────────────────────────────────

export function followupTemplate(stage: string, followupNumber: 1 | 2 | 3, name?: string | null, c = '$'): { subject: string; html: string } | null {
  // What to pitch based on stage (the stage they're stuck at)
  if (stage === 'sketchup-free') {
    const subjects = [
      '⚡ Quick reminder — your AI Rendering upgrade is waiting',
      `🔥 Last 24 hours: Add renders for just ${c}9 (then it goes up)`,
      `⚠️ Final notice: ${c}9 AI Rendering offer expires tonight`,
    ];
    return {
      subject: subjects[followupNumber - 1],
      html: wrap(`
        ${hdr(
          followupNumber === 1 ? 'Did you see this?' :
          followupNumber === 2 ? 'This offer ends soon.' :
          'Last chance.',
          'Your SketchUp course is a great start — but this is what gets you paid.',
          followupNumber === 3 ? '#7f1d1d' : '#1e293b'
        )}
        <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px;color:#374151;font-size:16px;font-weight:600;">${getGreeting(name)}</p>
        <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.7;">
            ${followupNumber === 1
              ? 'You claimed your free SketchUp course — that\'s a great first step. But here\'s the thing: <strong>SketchUp alone won\'t land you clients.</strong>'
              : followupNumber === 2
              ? `Over 50,000 design students have used Avada courses to level up. The biggest difference between the ones who get ${c}200 gigs and the ones who get <strong>${c}2,000–${c}5,000 projects</strong>? AI Rendering.`
              : `This is our final reminder. After today, the ${c}9 introductory price for V-Ray AI + D5 Render AI goes back to regular pricing.`}
          </p>
          <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;">
            Clients don't buy wireframes. They buy <strong>photorealistic renders</strong> and <strong>4K video walkthroughs</strong>. V-Ray AI and D5 Render AI teach you exactly that — and right now you can add both for just <strong>${c}9</strong>.
          </p>
          ${missBox([
            {
              emoji: '⚡',
              title: `V-Ray AI + D5 Render AI — Just ${c}9`,
              desc: `Photorealistic renders. Real-time 4K walkthroughs. The exact skills your clients are paying ${c}2,000–${c}5,000 for.`,
              price: `${c}9 one-time`,
              link: BUY.renders,
            },
            {
              emoji: '🏆',
              title: 'Full 12-Course Bundle',
              desc: 'Everything — SketchUp, renders, AutoCAD, Revit, 3ds Max, Lumion and more. One price, lifetime access.',
              price: `${c}27 one-time`,
              link: BUY.checkout,
            },
            {
              emoji: '📚',
              title: '6 Interior Design Books',
              desc: 'Space Planning, Lighting, Materials, Kitchen & Bedroom Design. The reference library every pro needs.',
              price: `${c}36 one-time`,
              link: BUY.books,
            },
          ])}
          ${whatsapp()}
        </td></tr>`),
    };
  }

  if (stage === 'render-bundle') {
    const subjects = [
      '🏆 You have renders — now complete the toolkit',
      '📐 AutoCAD & Revit skills are on 87% of job listings. Do you have them?',
      `⚠️ Final reminder: Complete your design education at ${c}27`,
    ];
    return {
      subject: subjects[followupNumber - 1],
      html: wrap(`
        ${hdr(
          followupNumber === 1 ? 'You\'ve got rendering covered. What about the rest?' :
          followupNumber === 2 ? 'Most job listings require more than renders.' :
          'Last call on the complete bundle.',
          'Complete your professional design toolkit.',
          followupNumber === 3 ? '#7f1d1d' : '#0c4a6e'
        )}
        <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px;color:#374151;font-size:16px;font-weight:600;">${getGreeting(name)}</p>
        <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.7;">
            ${followupNumber === 1
              ? 'You made a smart move adding AI rendering. But to work at top studios or run your own firm, you need <strong>AutoCAD, Revit, Lumion and 3ds Max</strong> too.'
              : followupNumber === 2
              ? 'We analyzed 500 architecture & interior design job postings. <strong>87% required AutoCAD. 71% required Revit.</strong> These aren\'t optional — they\'re baseline.'
              : `This is our last message about completing your toolkit. The ${c}27 all-course bundle is a one-time offer that goes back to individual pricing soon.`}
          </p>
          ${missBox([
            {
              emoji: '🏆',
              title: `Complete 9-Course Bundle — Just ${c}27`,
              desc: 'AutoCAD 2D/3D, Revit, Lumion, 3ds Max + Corona, Enscape VR, Photoshop, Illustrator, SketchUp Advanced, AI Tools. All 9 courses, lifetime access.',
              price: `${c}27 one-time`,
              link: BUY.fullBundle,
            },
            {
              emoji: '📚',
              title: '6 Interior Design Books',
              desc: 'Space Planning, Lighting, Materials, Kitchen & Bedroom Design. The reference edge that separates good designers from great ones.',
              price: `${c}36 one-time`,
              link: BUY.books,
            },
          ])}
          ${whatsapp()}
        </td></tr>`),
    };
  }

  if (stage === 'full-bundle') {
    const subjects = [
      '📚 Great designers know more than software — here\'s what\'s missing',
      '📐 The design books top firms use — available to you right now',
      '⚠️ Last chance: Complete your library with 6 design books',
    ];
    return {
      subject: subjects[followupNumber - 1],
      html: wrap(`
        ${hdr(
          followupNumber === 1 ? 'One more thing separates good from great.' :
          followupNumber === 2 ? 'Design principles outlast any software.' :
          'Complete your professional library.',
          '6 interior design books — the reference edge professionals use.',
          followupNumber === 3 ? '#7f1d1d' : '#065f46'
        )}
        <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 16px;color:#374151;font-size:16px;font-weight:600;">${getGreeting(name)}</p>
        <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.7;">
            ${followupNumber === 1
              ? 'You\'ve mastered the software. But the best designers also deeply understand <strong>space, light, material and human behaviour</strong>. That\'s what these 6 books teach.'
              : followupNumber === 2
              ? 'Software changes every 2 years. Design principles don\'t. The most successful designers we\'ve trained all say the same thing: <strong>"I wish I\'d read these books earlier."</strong>'
              : 'This is our final reminder. Add the 6 design books and complete your professional library.'}
          </p>
          ${missBox([
            {
              emoji: '📚',
              title: `6 Interior Design Books — Just ${c}36`,
              desc: 'Space Planning Fundamentals, Materials & Textures, Lighting Design, The Kitchen Design Bible, Bedroom Interiors Pro, Commercial Interior Spaces.',
              price: `${c}36 one-time`,
              link: BUY.books,
            },
          ])}
          ${whatsapp()}
        </td></tr>`),
    };
  }

  return null; // books-bundle = complete, no follow-ups
}

// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────

function getTemplate(product: string, name?: string | null, c = '$'): { subject: string; html: string } {
  switch (product) {
    case 'sketchup':         return tSketchupFree(name, c);
    case 'render':           return tRenderBundle(name, c);
    case 'full':             return tFullBundle(name, c);
    case 'books':            return tBooks(name, c);
    case 'downsell':         return tDownsell(name, c);
    default:                 return tRenderBundle(name, c); // safety fallback
  }
}

// ─────────────────────────────────────────────
// SEND VIA RESEND
// ─────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string, apiKey: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'AVADA Courses <hello@archbysha.com>', to: [to], subject, html }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'Resend error');
  }
}

// ─────────────────────────────────────────────
// SERVE
// ─────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { email, product = 'full-bundle', whatsapp, name, role, currencySymbol } = await req.json();
    const c = currencySymbol || '$';
    if (!email) throw new Error('email is required');

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set');

    // ── Send immediate access email ──
    const template = getTemplate(product, name, c);
    await sendEmail(email, template.subject, template.html, RESEND_API_KEY);

    // ── Upsert lead into DB ──
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: existing } = await supabase
      .from('leads')
      .select('stage')
      .eq('email', email)
      .maybeSingle();

    // stage is now a CSV of purchased products (e.g., 'render,full,books')
    const currentStages = existing?.stage ? existing.stage.split(',').map(s => s.trim()) : [];
    const isNewProduct = !currentStages.includes(product);
    
    if (isNewProduct) {
      currentStages.push(product);
    }
    
    const newStageString = currentStages.join(',');

    await supabase.from('leads').upsert(
      {
        email,
        whatsapp: whatsapp ?? null,
        name: name ?? null,
        role: role ?? null,
        stage: newStageString,
        currency_symbol: c,
        ...(isNewProduct ? { followup_1_at: null, followup_2_at: null, followup_3_at: null } : {}),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );

    return new Response(JSON.stringify({ success: true, product }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[send-access-email]', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
