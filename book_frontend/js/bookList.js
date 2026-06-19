/**
 * Book List Management
 * Xử lý tải, render danh sách sách với pagination
 */

let currentPage = 1;
let currentPageSize = 20;
let currentFilters = {};

/**
 * Tải danh sách sách từ API
 * @param {number} page - Trang hiện tại
 * @param {number} pageSize - Số item trên mỗi trang
 * @param {object} filters - Filters cần áp dụng
 */
async function loadBooks(page = 1, pageSize = 20, filters = {}) {
    currentPage = page;
    currentPageSize = pageSize;
    currentFilters = filters;

    const params = new URLSearchParams({ page, page_size: pageSize, ...filters });
    const response = await apiFetch(`/api/books/?${params}`);
    if (!response) return;

    const data = await response.json();
    renderBookTable(data.results || []);
    renderPagination(data.count, data.next, data.previous);
}

/**
 * Render bảng sách
 * @param {array} books - Danh sách sách
 */
function renderBookTable(books) {
    const tbody = document.getElementById('book-table-body');
    tbody.innerHTML = '';

    if (!books || books.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Không có sách nào</td></tr>`;
        return;
    }

    books.forEach(book => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${book.id}</td>
            <td>${escapeHtml(book.title)}</td>
            <td>${escapeHtml(book.author)}</td>
            <td>${Number(book.price).toLocaleString('vi-VN')} VND</td>
            <td>${book.quantity}</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="showDetail(${book.id})" title="Xem chi tiết">
                    <i class="bi bi-eye"></i> Detail
                </button>
                <button class="btn btn-sm btn-warning me-1" onclick="showEditForm(${book.id})" title="Chỉnh sửa">
                    <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmDelete(${book.id}, '${escapeHtml(book.title)}')" title="Xóa">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Render pagination info
 * @param {number} count - Tổng số sách
 * @param {string} next - URL trang kế tiếp
 * @param {string} previous - URL trang trước đó
 */
function renderPagination(count, next, previous) {
    const totalPages = Math.ceil(count / currentPageSize);
    document.getElementById('page-info').textContent = 
        `Trang ${currentPage} / ${totalPages} (Tổng: ${count} sách)`;
    document.getElementById('btn-prev').disabled = !previous;
    document.getElementById('btn-next').disabled = !next;
}

/**
 * Chuyển tới trang trước
 */
function goToPrevPage() {
    if (currentPage > 1) loadBooks(currentPage - 1, currentPageSize, currentFilters);
}

/**
 * Chuyển tới trang kế tiếp
 */
function goToNextPage() {
    loadBooks(currentPage + 1, currentPageSize, currentFilters);
}

/**
 * Thay đổi số items trên mỗi trang
 * @param {string} size - Kích thước trang
 */
function changePageSize(size) {
    currentPageSize = parseInt(size);
    loadBooks(1, currentPageSize, currentFilters);
}

/**
 * Escape HTML special characters
 * @param {string} text - Text cần escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
