import { API_URL } from "../config.js";

const categoryFilter = document.getElementById("category-filter");
const refreshBtn = document.getElementById("refresh-btn");
const tableBody = document.getElementById("audit-table-body");
const pagination = document.getElementById("audit-pagination");

let currentPage = 1;

function formatDate(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function renderRows(logs) {
  if (!logs.length) {
    tableBody.innerHTML =
      '<tr><td colspan="4" class="empty-state">No audit entries found.</td></tr>';
    return;
  }

  tableBody.innerHTML = logs
    .map((log) => {
      const performer = log.performedBy
        ? `${log.performedBy.fname ?? ""} ${log.performedBy.lname ?? ""}`.trim()
        : "System";

      return `
        <tr>
          <td>${log.description}</td>
          <td><span class="audit-category-tag">${log.category}</span></td>
          <td>${performer || "System"}</td>
          <td>${formatDate(log.createdAt)}</td>
        </tr>`;
    })
    .join("");
}

function renderPagination(paginationData) {
  const { page, pages } = paginationData;

  if (pages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  pagination.innerHTML = `
    <button id="prev-page" ${page <= 1 ? "disabled" : ""}>Previous</button>
    <span>Page ${page} of ${pages}</span>
    <button id="next-page" ${page >= pages ? "disabled" : ""}>Next</button>
  `;

  document.getElementById("prev-page").addEventListener("click", () => {
    currentPage = Math.max(currentPage - 1, 1);
    loadAuditLog();
  });

  document.getElementById("next-page").addEventListener("click", () => {
    currentPage += 1;
    loadAuditLog();
  });
}

async function loadAuditLog() {
  tableBody.innerHTML =
    '<tr><td colspan="4" class="empty-state">Loading audit log...</td></tr>';

  try {
    const params = new URLSearchParams({ page: currentPage, limit: 20 });
    if (categoryFilter.value) params.set("category", categoryFilter.value);

    const response = await fetch(`${API_URL}/audit?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      tableBody.innerHTML =
        '<tr><td colspan="4" class="empty-state">Could not load audit log.</td></tr>';
      return;
    }

    renderRows(data.logs);
    renderPagination(data.pagination);
  } catch (error) {
    console.error("Failed to load audit log:", error);
    tableBody.innerHTML =
      '<tr><td colspan="4" class="empty-state">Could not load audit log.</td></tr>';
  }
}

categoryFilter.addEventListener("change", () => {
  currentPage = 1;
  loadAuditLog();
});

refreshBtn.addEventListener("click", () => loadAuditLog());

loadAuditLog();
