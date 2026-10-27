import DOMPurify from 'dompurify';
import { marked } from 'marked';

const root = document.querySelector<HTMLElement>('[data-locked-post]');
const form = root?.querySelector<HTMLFormElement>('[data-unlock-form]');
const status = root?.querySelector<HTMLElement>('[data-unlock-status]');
const content = root?.querySelector<HTMLElement>('[data-unlocked-content]');
const heading = root?.querySelector<HTMLElement>('[data-unlocked-heading]');
const body = root?.querySelector<HTMLElement>('[data-unlocked-body]');
const payloadElement = root?.querySelector<HTMLScriptElement>('[data-locked-payload]');

function decodeBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form || !status || !content || !heading || !body || !payloadElement) return;

  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const passwordInput = form.elements.namedItem('password');
  if (!(passwordInput instanceof HTMLInputElement)) return;

  let payload: { version: number; iterations: number; salt: string; iv: string; ciphertext: string };
  try {
    payload = JSON.parse(payloadElement.textContent ?? '');
    if (payload.version !== 1) throw new Error('Unsupported encrypted post version.');
  } catch {
    status.textContent = 'تعذّر قراءة المقال المحمي. أعد تحميل الصفحة وحاول مجددًا.';
    return;
  }

  submitButton && (submitButton.disabled = true);
  passwordInput.disabled = true;
  status.textContent = 'جارٍ التحقق…';

  try {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(passwordInput.value),
      'PBKDF2',
      false,
      ['deriveKey'],
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: decodeBase64(payload.salt).buffer,
        iterations: payload.iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    );
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: decodeBase64(payload.iv).buffer, tagLength: 128 },
      key,
      decodeBase64(payload.ciphertext).buffer,
    );
    const markdown = new TextDecoder().decode(plaintext);
    const rendered = await marked.parse(markdown);

    body.innerHTML = DOMPurify.sanitize(rendered, { USE_PROFILES: { html: true } });
    form.hidden = true;
    content.hidden = false;
    status.textContent = '';
    heading.focus();
  } catch {
    status.textContent = 'كلمة المرور غير صحيحة. حاول مجددًا.';
    passwordInput.value = '';
    passwordInput.focus();
  } finally {
    passwordInput.disabled = false;
    if (submitButton) submitButton.disabled = false;
  }
});
