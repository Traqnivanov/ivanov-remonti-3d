import type { SupabaseClient } from "@supabase/supabase-js";
import { prepareNewProjectDraft } from "./project-repository";
import { createSupabaseProjectReadRepository } from "./supabase-project-repository";

const QA_PROJECT_TITLE = "QA — P2.4b Create List Open";

export async function runRepositoryLiveQa(
  mount: HTMLElement,
  client: SupabaseClient,
  ownerUserId: string,
): Promise<void> {
  mount.innerHTML = `
    <main class="work-login-shell">
      <section class="work-login-card" aria-labelledby="repoQaTitle">
        <div class="work-login-brand">
          <span class="work-login-mark" aria-hidden="true">IR</span>
          <div>
            <strong>IVANOV REMONTI</strong>
            <span>Persistence QA · P2.4b</span>
          </div>
        </div>
        <div class="work-login-heading">
          <p class="work-login-kicker">LIVE REPOSITORY QA</p>
          <h1 id="repoQaTitle">Create → List → Open</h1>
          <p id="repoQaStatus">Проверка на реалния Supabase repository…</p>
        </div>
        <pre id="repoQaResult" class="repo-qa-result" aria-live="polite"></pre>
      </section>
    </main>
  `;

  const status = mustGet<HTMLElement>(mount, "repoQaStatus");
  const result = mustGet<HTMLElement>(mount, "repoQaResult");

  try {
    const repository = createSupabaseProjectReadRepository(
      client,
      ownerUserId,
    );

    let projects = await repository.list();
    let qaItem = projects.find(
      (project) => project.title === QA_PROJECT_TITLE,
    );
    let created = false;

    if (!qaItem) {
      const draft = prepareNewProjectDraft(QA_PROJECT_TITLE);
      const opened = await repository.create(draft);
      qaItem = {
        id: opened.id,
        title: opened.title,
        status: opened.status,
        schemaVersion: opened.schemaVersion,
        workVersion: opened.workVersion,
        updatedAt: opened.updatedAt,
      };
      created = true;
      projects = await repository.list();
    }

    const listed = projects.find(
      (project) => project.id === qaItem.id,
    );

    if (!listed) {
      throw new Error("Created QA project was not returned by list().");
    }

    const opened = await repository.open(qaItem.id);

    if (
      opened.id !== qaItem.id ||
      opened.project.projectId !== qaItem.id ||
      opened.ownerUserId !== ownerUserId ||
      opened.schemaVersion !== 1 ||
      opened.workVersion < 1
    ) {
      throw new Error("Opened QA project does not match repository contract.");
    }

    status.textContent = "PASS — реалният Create → List → Open работи.";
    result.textContent = [
      `createdNow: ${created ? "yes" : "no"}`,
      `projectId: ${opened.id}`,
      `title: ${opened.title}`,
      `workVersion: ${opened.workVersion}`,
      `ownerMatch: yes`,
      `projectIdRoundTrip: yes`,
    ].join("\n");
    result.dataset.state = "pass";
  } catch (error) {
    console.error("P2.4b live repository QA failed", error);
    status.textContent = "FAIL — repository проверката не мина.";
    result.textContent =
      error instanceof Error ? error.message : String(error);
    result.dataset.state = "fail";
  }
}

function mustGet<T extends HTMLElement>(
  mount: HTMLElement,
  id: string,
): T {
  const element = mount.querySelector<HTMLElement>(`#${id}`);
  if (!element) throw new Error(`Missing #${id}`);
  return element as T;
}
