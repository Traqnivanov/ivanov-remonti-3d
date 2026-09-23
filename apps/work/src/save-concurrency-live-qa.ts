import type { SupabaseClient } from "@supabase/supabase-js";
import { ProjectRepositoryError, prepareSaveProject } from "./project-repository";
import { createSupabaseProjectReadRepository } from "./supabase-project-repository";

const QA_PROJECT_TITLE = "QA — P2.4b Create List Open";
const EXPECTED_STALE_VERSION = 1;

export async function runSaveConcurrencyLiveQa(
  mount: HTMLElement,
  client: SupabaseClient,
  ownerUserId: string,
): Promise<void> {
  mount.innerHTML = `
    <main class="work-login-shell">
      <section class="work-login-card" aria-labelledby="saveQaTitle">
        <div class="work-login-brand">
          <span class="work-login-mark" aria-hidden="true">IR</span>
          <div>
            <strong>IVANOV REMONTI</strong>
            <span>Persistence QA · P2.4c</span>
          </div>
        </div>
        <div class="work-login-heading">
          <p class="work-login-kicker">LIVE CONCURRENCY QA</p>
          <h1 id="saveQaTitle">Save 1 → 2 · stale retry</h1>
          <p id="saveQaStatus">Проверка на optimistic concurrency…</p>
        </div>
        <pre id="saveQaResult" class="repo-qa-result" aria-live="polite"></pre>
      </section>
    </main>
  `;

  const status = mustGet<HTMLElement>(mount, "saveQaStatus");
  const result = mustGet<HTMLElement>(mount, "saveQaResult");

  try {
    const repository = createSupabaseProjectReadRepository(client, ownerUserId);
    const projects = await repository.list();
    const qaItem = projects.find((project) => project.title === QA_PROJECT_TITLE);

    if (!qaItem) {
      throw new Error("Bounded QA project was not found.");
    }

    const opened = await repository.open(qaItem.id);

    let saveVersion = opened.workVersion;
    let savedNow = false;

    if (opened.workVersion === EXPECTED_STALE_VERSION) {
      opened.project.room.name = "Дневна — QA Save v2";
      const saved = await repository.save(
        prepareSaveProject(opened.project, EXPECTED_STALE_VERSION),
      );

      if (saved.workVersion !== 2) {
        throw new Error(
          `Expected successful save to return version 2, got ${saved.workVersion}.`,
        );
      }

      saveVersion = saved.workVersion;
      savedNow = true;
    } else if (opened.workVersion !== 2) {
      throw new Error(
        `QA project is at unexpected version ${opened.workVersion}; expected 1 or 2.`,
      );
    }

    const staleProject = {
      ...opened.project,
      room: {
        ...opened.project.room,
        name: "Дневна — stale attempt must not win",
      },
    };

    let staleWriteProven = false;
    try {
      await repository.save(
        prepareSaveProject(staleProject, EXPECTED_STALE_VERSION),
      );
    } catch (error) {
      if (
        error instanceof ProjectRepositoryError &&
        error.code === "STALE_WRITE"
      ) {
        staleWriteProven = true;
      } else {
        throw error;
      }
    }

    if (!staleWriteProven) {
      throw new Error("Stale retry unexpectedly succeeded.");
    }

    const finalOpened = await repository.open(qaItem.id);
    if (finalOpened.workVersion !== 2) {
      throw new Error(
        `Final project version changed unexpectedly: ${finalOpened.workVersion}.`,
      );
    }

    if (finalOpened.project.room.name !== "Дневна — QA Save v2") {
      throw new Error(
        "Stale retry overwrote the successfully saved canonical state.",
      );
    }

    status.textContent =
      "PASS — save 1→2 работи и старият save е отхвърлен като STALE_WRITE.";
    result.textContent = [
      `savedNow: ${savedNow ? "yes" : "already-at-v2"}`,
      `projectId: ${finalOpened.id}`,
      `finalWorkVersion: ${finalOpened.workVersion}`,
      `successfulStatePreserved: yes`,
      `staleWriteRejected: yes`,
    ].join("\n");
    result.dataset.state = "pass";
  } catch (error) {
    console.error("P2.4c live concurrency QA failed", error);
    status.textContent = "FAIL — concurrency проверката не мина.";
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
