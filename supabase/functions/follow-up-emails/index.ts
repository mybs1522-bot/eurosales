import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Follow-up timing ──
const FOLLOWUP_1_HOURS = 1;   // 1 hour after stage
const FOLLOWUP_2_HOURS = 24;  // 24 hours after stage
const FOLLOWUP_3_HOURS = 72;  // 72 hours after stage


// ── Buy links ──
const BUY = {
  renders:    'https://start.avadalearn.com/',
  fullBundle: 'https://start.avadalearn.com/onetime',
  books:      'https://start.avadalearn.com/offer',
  checkout:   'https://start.avadalearn.com/checkout',
};

// ─────────────────────────────────────────────
// INLINE FOLLOW-UP TEMPLATES
// ─────────────────────────────────────────────

function getGreeting(name?: string | null): string {
  if (!name) return 'Hi there,';
  const firstName = name.split(' ')[0];
  return `Hi ${firstName},`;
}

// (copied here to avoid import issues in edge runtime)
// ─────────────────────────────────────────────

const hdr = (title: string, sub: string, color = '#1e293b') =>
  `<tr><td style="background:${color};padding:32px 40px;">
<p style="margin:0;color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">AVADA DESIGN</p>
<h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:900;line-height:1.2;">${title}</h1>
<p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:14px;">${sub}</p>
</td></tr>`;

const buyBtn = (link: string, label: string, price: string) =>
  `<a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">${label} — ${price} →</a>`;

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
</td></tr>${rows}</table>`;
};

const whatsapp = () =>
  `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;">
<tr><td style="padding:18px 22px;">
<p style="margin:0 0 12px;color:#166534;font-size:13px;font-weight:700;">Need help? We're here 24/7.</p>
<a href="https://wa.me/919198747810" style="display:inline-block;background:#25D366;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">💬 Chat on WhatsApp</a>
</td></tr></table>`;

function wrap(body: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f5;font-family:system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
${body}
<tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
<p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 Avada Design.<br>
<a href="https://start.avadalearn.com" style="color:#9ca3af;">Visit us</a> · <a href="mailto:hello@archbysha.com?subject=Unsubscribe" style="color:#9ca3af;">Unsubscribe</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function getFollowupTemplate(stage: string, num: 1 | 2 | 3, name?: string | null, c = '$'): { subject: string; html: string } | null {
  if (stage === 'sketchup-free') {
    const subjects = [
      '⚡ Quick reminder — your AI Rendering upgrade is still available',
      `🔥 24 hours later: Add renders for just ${c}9 (then price goes up)`,
      `⚠️ Final notice — ${c}9 AI Rendering offer closes tonight`,
    ];
    const intros = [
      'You grabbed the free SketchUp course — great start. But <strong>SketchUp alone won\'t get you clients.</strong> Here\'s what\'s missing from your toolkit:',
      `Over 50,000 design students have used Avada courses to land better projects. The difference between the ones earning ${c}200 gigs vs <strong>${c}2,000–${c}5,000 projects</strong>? AI Rendering.`,
      `This is our last message about the ${c}9 AI Rendering upgrade. After today, it goes back to regular pricing. Don't miss this.`,
    ];
    return {
      subject: subjects[num - 1],
      html: wrap(`
        ${hdr('Your skills are incomplete. Here\'s the fix.', 'SketchUp is just the foundation.', num === 3 ? '#7f1d1d' : '#1e293b')}
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 16px;color:#374151;font-size:16px;font-weight:600;">${getGreeting(name)}</p>
          <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.7;">${intros[num - 1]}</p>
          ${missBox([
            { emoji: '⚡', title: 'V-Ray AI + D5 Render AI', desc: `Photorealistic renders and 4K video walkthroughs using AI. Designers with this skill charge ${c}2,000–${c}5,000 per project — not ${c}200.`, price: `${c}9 one-time`, link: BUY.renders },
            { emoji: '🏆', title: 'Complete 12-Course Bundle', desc: 'SketchUp + Renders + AutoCAD + Revit + Lumion + 3ds Max + more. Everything in one library.', price: `${c}27 one-time`, link: BUY.checkout },
            { emoji: '📚', title: '6 Interior Design Books', desc: 'Space Planning, Lighting, Materials, Kitchen & Bedroom Design — professional references used in real firms.', price: `${c}36 one-time`, link: BUY.books },
          ])}
          ${whatsapp()}
        </td></tr>`),
    };
  }

  if (stage === 'render-bundle') {
    const subjects = [
      `🏆 You have renders — now complete the toolkit (${c}27)`,
      '📐 AutoCAD & Revit are in 87% of job listings. Do you have them?',
      `⚠️ Final reminder: Complete your design education for ${c}27`,
    ];
    return {
      subject: subjects[num - 1],
      html: wrap(`
        ${hdr('Great renders. But your toolkit isn\'t complete.', 'The courses top studios look for are still missing.', num === 3 ? '#7f1d1d' : '#0c4a6e')}
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 16px;color:#374151;font-size:16px;font-weight:600;">${getGreeting(name)}</p>
          <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.7;">
            ${num === 1 ? 'You\'ve got AI rendering covered — that puts you ahead of 80% of students. But to work at top studios or run your own firm, <strong>AutoCAD, Revit and Lumion</strong> are non-negotiable.'
              : num === 2 ? 'We analysed 500 architecture job postings. <strong>87% required AutoCAD. 71% required Revit.</strong> These are baseline skills — not extras.'
              : `Last message on this. The ${c}27 complete bundle is a one-time offer. Once you move on, it goes back to individual pricing.`}
          </p>
          ${missBox([
            { emoji: '🏆', title: 'Complete 9-Course Bundle', desc: 'AutoCAD 2D/3D, Revit Architecture, Lumion, 3ds Max + Corona, Enscape VR, Photoshop, Illustrator, SketchUp Advanced, AI Tools. All 9, lifetime access.', price: `${c}27 one-time`, link: BUY.fullBundle },
            { emoji: '📚', title: '6 Interior Design Books', desc: 'Space Planning, Materials, Lighting, Kitchen, Bedroom, Commercial Interiors. The reference library real professionals use.', price: `${c}36 one-time`, link: BUY.books },
          ])}
          ${whatsapp()}
        </td></tr>`),
    };
  }

  if (stage === 'full-bundle') {
    const subjects = [
      '📚 Great designers know more than software — here\'s what\'s missing',
      '📐 The reference books top firms use — available right now',
      `⚠️ Last chance: 6 professional design books for ${c}36`,
    ];
    return {
      subject: subjects[num - 1],
      html: wrap(`
        ${hdr('One thing separates good from great designers.', 'Design principles that no software can teach.', num === 3 ? '#7f1d1d' : '#065f46')}
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 16px;color:#374151;font-size:16px;font-weight:600;">${getGreeting(name)}</p>
          <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.7;">
            ${num === 1 ? 'You\'ve mastered the tools. But the best designers also deeply understand <strong>space, light, material and proportion</strong>. These 6 books teach that — and set you apart from every other design student.'
              : num === 2 ? 'Software gets outdated. Design principles don\'t. The most successful alumni from our community say the same thing: <strong>"I wish I\'d read these books earlier."</strong>'
              : `This is our final reminder. 6 professional interior design books, ${c}36 one-time. Your permanent professional reference library.`}
          </p>
          ${missBox([
            { emoji: '📚', title: `6 Interior Design Books — ${c}36`, desc: 'Space Planning Fundamentals, Materials & Textures, Lighting Design, The Kitchen Design Bible, Bedroom Interiors Pro, Commercial Interior Spaces. One price, yours forever.', price: `${c}36 one-time`, link: BUY.books },
          ])}
          ${whatsapp()}
        </td></tr>`),
    };
  }

  return null;
}

// ─────────────────────────────────────────────
// SERVE — called by Supabase cron every hour
// ─────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const now = new Date();
  const results: string[] = [];

  // Fetch leads who still need follow-ups
  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, email, name, stage, updated_at, followup_1_at, followup_2_at, followup_3_at, currency_symbol')
    .is('followup_3_at', null);

  if (error || !leads) return new Response(JSON.stringify({ error }), { status: 500, headers: corsHeaders });

  for (const lead of leads) {
    const stages = lead.stage ? lead.stage.split(',').map((s: string) => s.trim()) : [];
    const hasRender = stages.includes('render');
    const hasFull = stages.includes('full');
    const hasBooks = stages.includes('books');
    const hasDownsell = stages.includes('downsell');

    let targetPitchStage: string | null = null;
    
    if (hasRender && !hasFull) {
      targetPitchStage = 'render-bundle'; // pitch full courses
    } else if (hasFull && !hasBooks && !hasDownsell) {
      targetPitchStage = 'full-bundle'; // pitch books
    } else if (!hasRender && !hasFull && !hasBooks && !hasDownsell) {
      targetPitchStage = 'sketchup-free'; // base fallback
    }

    if (!targetPitchStage) {
      // Completed the funnel! Stop processing
      await supabase.from('leads').update({
        followup_1_at: '2099-01-01T00:00:00Z',
        followup_2_at: '2099-01-01T00:00:00Z',
        followup_3_at: '2099-01-01T00:00:00Z'
      }).eq('id', lead.id);
      results.push(`✅ Marked ${lead.email} as complete`);
      continue;
    }

    const stageAge = (now.getTime() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60);

    let followupNum: 1 | 2 | 3 | null = null;
    if (!lead.followup_1_at && stageAge >= FOLLOWUP_1_HOURS) followupNum = 1;
    else if (lead.followup_1_at && !lead.followup_2_at && stageAge >= FOLLOWUP_2_HOURS) followupNum = 2;
    else if (lead.followup_2_at && !lead.followup_3_at && stageAge >= FOLLOWUP_3_HOURS) followupNum = 3;

    if (!followupNum) continue;

    const leadCurrency = lead.currency_symbol || '$';
    const template = getFollowupTemplate(targetPitchStage, followupNum, lead.name, leadCurrency);
    if (!template) continue;

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'AVADA Courses <hello@archbysha.com>',
          to: [lead.email],
          subject: template.subject,
          html: template.html,
        }),
      });

      await supabase.from('leads').update({
        [`followup_${followupNum}_at`]: now.toISOString(),
      }).eq('id', lead.id);

      results.push(`✅ Sent followup ${followupNum} to ${lead.email} (pitching ${targetPitchStage})`);
    } catch (e: any) {
      results.push(`❌ Failed for ${lead.email}: ${e.message}`);
    }
  }

  return new Response(JSON.stringify({ processed: results.length, results }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
