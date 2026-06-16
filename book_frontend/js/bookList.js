let currentPage = 1;
let currentPageSize = 20;
let currentFilters = {};

async function loadBooks(page = 1, pageSize = 20, filters = {}) {
    currentPage = page;
    currentPageSize = pageSize;
    currentFilters = filters;

    const params = new URLSearchParams({ page, page_size: pageSize, ...filters });
    const response = await apiFetch(`/api/books/?${params}`);
    if (!response) return;

    const data = await response.json();
    renderBookTable(data.results);
    renderPagination(data.count, data.next, data.previous);
}

function renderBookTable(books) {
    const tbody = document.getElementById('book-table-body');
    tbody.innerHTML = '';

    if (books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Khong co sach nao</td></tr>`;
        return;
    }

    books.forEach(book => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${Number(book.price).toLocaleString()} VND</td>
            <td>${book.quantity}</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="showDetail(${book.id})">Detail</button>
                <button class="btn btn-sm btn-warning me-1" onclick="showEditForm(${book.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="confirmDelete(${book.id}, '${book.title.replace(/'/g, "\\'")}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderPagination(count, next, previous) {
    const totalPages = Math.ceil(count / currentPageSize);
    document.getElementById('page-info').textContent = `Trang ${currentPage} / ${totalPages} (Tong: ${count} sach)`;
    document.getElementById('btn-prev').disabled = !previous;
    document.getElementById('btn-next').disabled = !next;
}

function goToPrevPage() {
    if (currentPage > 1) loadBooks(currentPage - 1, currentPageSize, currentFilters);
}

function goToNextPage() {
    loadBooks(currentPage + 1, currentPageSize, currentFilters);
}

function changePageSize(size) {
    currentPageSize = parseInt(size);
    loadBooks(1, currentPageSize, currentFilters);
}
