import {
  prepareNewProjectDraft,
  type ProjectListItem,
  type ProjectRepository,
} from "./project-repository";
import {
  createProjectSession,
  type ProjectSession,
} from "./project-session";

type OpenProjectsDialogOptions = {
  mount: HTMLElement;
  repository: ProjectRepository;
  currentSession: ProjectSession | null;
  initialProjects?: ProjectListItem[];
  startInCreate?: boolean;
  requireSelection?: boolean;
  onProjectReady: (session: ProjectSession) => void;
};

export function renderProjectBar(
  mount: HTMLElement,
  session: ProjectSession,
  options: {
    projectsEnabled: boolean;
    onProjects: () => void;
  },
): void {
  const title = mustGet<HTMLElement>(mount, "projectBarTitle");
  const status = mustGet<HTMLElement>(mount, "projectBarStatus");
  const projectsButton = mustGet<HTMLButtonElement>(
    mount,
    "projectsButton",
  );
  const saveButton = mustGet<HTMLButtonElement>(
    mount,
    "saveProjectButton",
  );

  title.textContent = session.title;
  title.title = session.title;
  status.textContent = `Запазено · v${session.workVersion}`;
  status.dataset.state = "clean";

  projectsButton.disabled = !options.projectsEnabled;
  projectsButton.addEventListener("click", options.onProjects);

  // P2.5c wires dirty/save/conflict behavior.
  saveButton.disabled = true;
}

export async function openProjectsDialog(
  options: OpenProjectsDialogOptions,
): Promise<void> {
  const {
    mount,
    repository,
    currentSession,
    onProjectReady,
    requireSelection = false,
    startInCreate = false,
  } = options;

  const existing = mount.querySelector<HTMLDialogElement>(
    "#projectsDialog",
  );
  existing?.remove();

  const dialog = document.createElement("dialog");
  dialog.id = "projectsDialog";
  dialog.className = "projects-dialog";
  dialog.setAttribute("aria-labelledby", "projectsDialogTitle");

  mount.append(dialog);

  let projects = options.initialProjects;
  let createMode = startInCreate;

  const closeDialog = (): void => {
    dialog.close();
    dialog.remove();
  };

  const render = (): void => {
    dialog.innerHTML = `
      <div class="projects-dialog-card">
        <div class="projects-dialog-head">
          <div>
            <p class="projects-dialog-kicker">WORK ПРОЕКТИ</p>
            <h2 id="projectsDialogTitle">Проекти</h2>
          </div>
          ${
            requireSelection
              ? ""
              : '<button id="projectsDialogClose" class="dialog-icon-button" type="button" aria-label="Затвори">×</button>'
          }
        </div>

        <p id="projectsDialogStatus" class="projects-dialog-status" role="status" aria-live="polite"></p>

        <div id="projectsList" class="projects-list"></div>

        <div class="projects-dialog-actions">
          <button id="newProjectButton" class="primary" type="button">Нов проект</button>
        </div>

        <form id="newProjectForm" class="new-project-form" ${
          createMode ? "" : "hidden"
        }>
          <label for="newProjectTitle">
            Име на проекта
            <input
              id="newProjectTitle"
              name="title"
              type="text"
              autocomplete="off"
              maxlength="100"
              required
            />
          </label>
          <div class="new-project-actions">
            <button id="cancelNewProjectButton" type="button">Откажи</button>
            <button id="createProjectButton" class="primary" type="submit">Създай</button>
          </div>
        </form>
      </div>
    `;

    const status = mustGet<HTMLElement>(
      dialog,
      "projectsDialogStatus",
    );
    const list = mustGet<HTMLElement>(dialog, "projectsList");
    const newButton = mustGet<HTMLButtonElement>(
      dialog,
      "newProjectButton",
    );
    const form = mustGet<HTMLFormElement>(dialog, "newProjectForm");
    const titleInput = mustGet<HTMLInputElement>(
      dialog,
      "newProjectTitle",
    );
    const cancelNewButton = mustGet<HTMLButtonElement>(
      dialog,
      "cancelNewProjectButton",
    );

    const closeButton =
      dialog.querySelector<HTMLButtonElement>("#projectsDialogClose");
    closeButton?.addEventListener("click", closeDialog);

    dialog.addEventListener(
      "cancel",
      (event) => {
        if (requireSelection) {
          event.preventDefault();
          return;
        }
        closeDialog();
      },
      { once: true },
    );

    renderProjectList(list, projects ?? [], currentSession, async (id) => {
      setDialogBusy(dialog, true);
      setStatus(status, "Отваряне на проекта…", "progress");

      try {
        const opened = await repository.open(id);
        closeDialog();
        onProjectReady(createProjectSession(opened));
      } catch (error) {
        setDialogBusy(dialog, false);
        setStatus(
          status,
          "Проектът не можа да се отвори. Опитайте отново.",
          "error",
        );
        console.error("Open project failed", error);
      }
    });

    if (!projects?.length) {
      list.innerHTML =
        '<p class="projects-empty">Все още няма създадени проекти.</p>';
    }

    newButton.addEventListener("click", () => {
      createMode = true;
      form.hidden = false;
      newButton.hidden = true;
      titleInput.focus();
    });

    cancelNewButton.addEventListener("click", () => {
      if (requireSelection && !projects?.length) {
        titleInput.value = "";
        titleInput.focus();
        return;
      }

      createMode = false;
      form.hidden = true;
      newButton.hidden = false;
      titleInput.value = "";
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const title = titleInput.value.trim();

      if (!title) {
        setStatus(status, "Въведете име на проекта.", "error");
        titleInput.focus();
        return;
      }

      setDialogBusy(dialog, true);
      setStatus(status, "Създаване на проекта…", "progress");

      try {
        const opened = await repository.create(
          prepareNewProjectDraft(title),
        );
        closeDialog();
        onProjectReady(createProjectSession(opened));
      } catch (error) {
        setDialogBusy(dialog, false);
        setStatus(
          status,
          "Проектът не можа да се създаде. Опитайте отново.",
          "error",
        );
        console.error("Create project failed", error);
      }
    });

    if (createMode) {
      newButton.hidden = true;
      queueMicrotask(() => titleInput.focus());
    }
  };

  if (!projects) {
    dialog.innerHTML = `
      <div class="projects-dialog-card">
        <p class="projects-dialog-status" data-state="progress">Зареждане на проектите…</p>
      </div>
    `;
  }

  if (!dialog.open) {
    dialog.showModal();
  }

  if (!projects) {
    try {
      projects = await repository.list();
    } catch (error) {
      dialog.innerHTML = `
        <div class="projects-dialog-card">
          <div class="projects-dialog-head">
            <div>
              <p class="projects-dialog-kicker">WORK ПРОЕКТИ</p>
              <h2 id="projectsDialogTitle">Проекти</h2>
            </div>
            ${
              requireSelection
                ? ""
                : '<button id="projectsDialogClose" class="dialog-icon-button" type="button" aria-label="Затвори">×</button>'
            }
          </div>
          <p class="projects-dialog-status" data-state="error">Проектите не могат да се заредят.</p>
          <button id="projectsRetryButton" class="primary" type="button">Опитай отново</button>
        </div>
      `;

      dialog
        .querySelector<HTMLButtonElement>("#projectsDialogClose")
        ?.addEventListener("click", closeDialog);

      mustGet<HTMLButtonElement>(
        dialog,
        "projectsRetryButton",
      ).addEventListener("click", () => {
        closeDialog();
        void openProjectsDialog({
          ...options,
          initialProjects: undefined,
        });
      });

      console.error("List projects failed", error);
      return;
    }
  }

  render();
}

export function renderProjectGate(
  mount: HTMLElement,
  message = "Зареждане на Work проект…",
): void {
  mount.innerHTML = `
    <div class="project-gate-shell">
      <header class="topbar">
        <div class="brand">
          <strong>IVANOV REMONTI · SMART OFFER</strong>
          <span>Work · Project access</span>
        </div>
      </header>
      <div class="project-bar">
        <div class="project-bar-current">
          <span class="project-bar-label">Текущ проект</span>
          <strong>Няма избран проект</strong>
          <span class="project-bar-status">—</span>
        </div>
      </div>
      <main class="project-gate-main">
        <p>${escapeHtml(message)}</p>
      </main>
    </div>
  `;
}

export function renderProjectGateError(
  mount: HTMLElement,
  onRetry: () => void,
): void {
  renderProjectGate(
    mount,
    "Проектите не могат да се заредят. Проверете връзката и опитайте отново.",
  );

  const main = mount.querySelector<HTMLElement>(".project-gate-main");
  if (!main) throw new Error("Missing project gate main");

  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "primary";
  retry.textContent = "Опитай отново";
  retry.addEventListener("click", onRetry);
  main.append(retry);
}

function renderProjectList(
  mount: HTMLElement,
  projects: ProjectListItem[],
  currentSession: ProjectSession | null,
  onOpen: (projectId: string) => void,
): void {
  mount.replaceChildren();

  for (const project of projects) {
    const row = document.createElement("div");
    row.className = "project-list-row";
    if (project.id === currentSession?.projectId) {
      row.dataset.current = "true";
    }

    const meta = document.createElement("div");
    meta.className = "project-list-meta";

    const title = document.createElement("strong");
    title.textContent = project.title;

    const detail = document.createElement("span");
    detail.textContent = `v${project.workVersion} · ${formatUpdatedAt(
      project.updatedAt,
    )}`;

    meta.append(title, detail);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent =
      project.id === currentSession?.projectId ? "Текущ" : "Отвори";
    button.disabled = project.id === currentSession?.projectId;
    button.addEventListener("click", () => onOpen(project.id));

    row.append(meta, button);
    mount.append(row);
  }
}

function setDialogBusy(
  dialog: HTMLDialogElement,
  busy: boolean,
): void {
  dialog
    .querySelectorAll<HTMLButtonElement | HTMLInputElement>(
      "button, input",
    )
    .forEach((element) => {
      element.disabled = busy;
    });
  dialog.setAttribute("aria-busy", String(busy));
}

function setStatus(
  element: HTMLElement,
  message: string,
  state: "progress" | "error",
): void {
  element.textContent = message;
  element.dataset.state = state;
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "неизвестна дата";

  return new Intl.DateTimeFormat("bg-BG", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mustGet<T extends HTMLElement>(
  mount: ParentNode,
  id: string,
): T {
  const element = mount.querySelector<HTMLElement>(`#${id}`);
  if (!element) throw new Error(`Missing #${id}`);
  return element as T;
}
