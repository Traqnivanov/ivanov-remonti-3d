import type { SupabaseClient } from "@supabase/supabase-js";
import type { WorkAccessState } from "./work-auth";
import { WorkSignInError, signInWorkUser } from "./work-sign-in";

type WorkLoginOptions = {
  mount: HTMLElement;
  client: SupabaseClient;
  access: Extract<WorkAccessState, { status: "signed-out" | "unauthorized" }>;
  onAuthorized: () => void;
};

export function renderWorkLogin({
  mount,
  client,
  access,
  onAuthorized,
}: WorkLoginOptions): void {
  mount.innerHTML = `
    <main class="work-login-shell">
      <section class="work-login-card" aria-labelledby="workLoginTitle">
        <div class="work-login-brand">
          <span class="work-login-mark" aria-hidden="true">IR</span>
          <div>
            <strong>IVANOV REMONTI</strong>
            <span>Smart Offer · Work</span>
          </div>
        </div>

        <div class="work-login-heading">
          <p class="work-login-kicker">ЧАСТЕН ДОСТЪП</p>
          <h1 id="workLoginTitle">Вход в Work</h1>
          <p>Влезте с разрешения служебен акаунт.</p>
        </div>

        <form id="workLoginForm" class="work-login-form" novalidate>
          <label for="workLoginEmail">
            Имейл
            <input
              id="workLoginEmail"
              name="email"
              type="email"
              inputmode="email"
              autocomplete="username"
              autocapitalize="none"
              spellcheck="false"
              required
            />
          </label>

          <label for="workLoginPassword">
            Парола
            <input
              id="workLoginPassword"
              name="password"
              type="password"
              autocomplete="current-password"
              required
            />
          </label>

          <button id="workLoginSubmit" class="primary work-login-submit" type="submit">
            Вход
          </button>

          <p id="workLoginStatus" class="work-login-status" role="status" aria-live="polite"></p>
        </form>

        <p class="work-login-footnote">
          Достъпът е само за предварително разрешени Work акаунти.
        </p>
      </section>
    </main>
  `;

  const form = mustGet<HTMLFormElement>(mount, "workLoginForm");
  const email = mustGet<HTMLInputElement>(mount, "workLoginEmail");
  const password = mustGet<HTMLInputElement>(mount, "workLoginPassword");
  const submit = mustGet<HTMLButtonElement>(mount, "workLoginSubmit");
  const status = mustGet<HTMLParagraphElement>(mount, "workLoginStatus");

  if (access.status === "unauthorized") {
    setStatus(
      status,
      "Този акаунт няма разрешение за Work.",
      "error",
    );
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submit.disabled = true;
    setStatus(status, "Проверка на достъпа…", "progress");

    try {
      const nextAccess = await signInWorkUser(client, {
        email: email.value,
        password: password.value,
      });

      if (nextAccess.status === "authorized") {
        password.value = "";
        onAuthorized();
        return;
      }

      if (nextAccess.status === "unauthorized") {
        password.value = "";
        setStatus(
          status,
          "Този акаунт няма разрешение за Work.",
          "error",
        );
        return;
      }

      setStatus(status, "Входът не беше завършен.", "error");
    } catch (error) {
      setStatus(status, messageForSignInError(error), "error");
    } finally {
      submit.disabled = false;
    }
  });
}

export function renderWorkAuthUnavailable(
  mount: HTMLElement,
  error: unknown,
): void {
  console.error("Work Auth bootstrap failed", error);

  mount.innerHTML = `
    <main class="work-login-shell">
      <section class="work-login-card work-login-card--error" role="alert">
        <div class="work-login-brand">
          <span class="work-login-mark" aria-hidden="true">IR</span>
          <div>
            <strong>IVANOV REMONTI</strong>
            <span>Smart Offer · Work</span>
          </div>
        </div>
        <div class="work-login-heading">
          <p class="work-login-kicker">WORK НЕДОСТЪПЕН</p>
          <h1>Не може да се стартира входът</h1>
          <p>Проверете Work конфигурацията и опитайте отново.</p>
        </div>
      </section>
    </main>
  `;
}

function messageForSignInError(error: unknown): string {
  if (!(error instanceof WorkSignInError)) {
    return "Входът не успя. Опитайте отново.";
  }

  switch (error.code) {
    case "EMAIL_REQUIRED":
      return "Въведете имейл.";
    case "PASSWORD_REQUIRED":
      return "Въведете парола.";
    case "SIGN_IN_FAILED":
      return "Невалиден имейл или парола.";
    case "SIGN_IN_INCOMPLETE":
      return "Входът не беше завършен. Опитайте отново.";
  }
}

function setStatus(
  element: HTMLElement,
  message: string,
  state: "error" | "progress",
): void {
  element.textContent = message;
  element.dataset.state = state;
}

function mustGet<T extends HTMLElement>(
  mount: HTMLElement,
  id: string,
): T {
  const element = mount.querySelector<HTMLElement>(`#${id}`);
  if (!element) throw new Error(`Missing #${id}`);
  return element as T;
}
