# PayPal Button – Email Not Sent After Payment (Fix)

## Problem

After a client pays via PayPal, the confirmation email is never sent.

## Root Cause: Stale Closure

PayPal SDK buttons are rendered once inside a `useEffect` that only runs when the SDK loads (`[ppReady]` dependency). The `onApprove` callback captures whatever `onSuccess` and `email` values existed at that moment — typically empty/initial state.

When the user later types their email and pays, the PayPal `onApprove` still calls the **old** `onSuccess` which has `email = ""`. The email function has a guard `if (!email) return;` so it silently does nothing.

**Stripe doesn't have this issue** because its `handleSubmit` runs fresh on form submission with current state.

## Fix: useRef for Latest Values

```tsx
// Keep refs to latest values so the PayPal onApprove closure never goes stale
const onSuccessRef = useRef(onSuccess);
onSuccessRef.current = onSuccess;
const emailRef = useRef(email);
emailRef.current = email;
```

Then in the PayPal button config:

```tsx
onApprove: async (_, actions) => {
  await actions.order.capture();
  onSuccessRef.current(); // always calls the latest callback
},
createOrder: (_, actions) =>
  actions.order.create({
    purchase_units: [{ amount: { value: amountVal } }],
    payer: { email_address: emailRef.current }, // always reads latest email
  }),
```

## Additional Safeguard: Block PayPal Without Email

PayPal's `onClick` + `actions.reject()` is unreliable across SDK versions. Instead, use a DOM overlay approach:

```tsx
const needsEmail = !email || !email.includes('@');

return (
  <div className="relative w-full" style={{ minHeight: 52 }}>
    {/* PayPal iframe container — disabled when no email */}
    <div
      ref={containerRef}
      className="w-full"
      style={needsEmail ? { pointerEvents: 'none' } : undefined}
    />
    {/* Invisible overlay intercepts clicks */}
    {needsEmail && (
      <div
        onClickCapture={(e) => { e.stopPropagation(); e.preventDefault(); showError(); }}
        onMouseDownCapture={(e) => { e.stopPropagation(); e.preventDefault(); }}
        className="absolute top-0 left-0 w-full h-full cursor-pointer"
        style={{ zIndex: 9999 }}
      />
    )}
  </div>
);
```

**Why this works:** `pointer-events: none` on the iframe container prevents it from receiving clicks. The overlay captures the event and shows an error message + shakes the email input.

## Error Message + Shake (above email input)

```tsx
const handleOverlayClick = () => {
  const emailInput = document.querySelector('input[type="email"]') as HTMLElement;
  if (emailInput) {
    // Insert error message above email input
    let errEl = document.getElementById('pp-email-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.id = 'pp-email-error';
      errEl.style.cssText = 'color:#ef4444;font-size:12px;margin:0 0 4px;font-weight:600;';
      errEl.textContent = 'Enter Your Mail Address';
      emailInput.parentElement?.parentElement?.insertBefore(errEl, emailInput.parentElement);
    }
    // Shake animation
    emailInput.classList.remove('shake-input');
    void emailInput.offsetWidth; // force reflow
    emailInput.classList.add('shake-input');
    emailInput.focus();
  }
};
```

CSS for shake:
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}
.shake-input { animation: shake 0.4s ease; }
```

Remove error when email becomes valid:
```tsx
useEffect(() => {
  if (email && email.includes('@')) {
    const existing = document.getElementById('pp-email-error');
    if (existing) existing.remove();
  }
}, [email]);
```

## Key Takeaways

1. **Any callback passed into PayPal's `useEffect` will go stale** — always use `useRef` to keep the latest reference.
2. **PayPal's `onClick` with `actions.reject()` is unreliable** — use `pointer-events: none` + overlay instead.
3. **Never trust that email will be filled** — always validate before allowing payment flow to start.
4. **Fire-and-forget email calls (`.catch(() => {})`) hide failures** — add logging or at minimum check the email isn't empty before calling.
