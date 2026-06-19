/**
 * Book Delete Management
 * Xử lý xóa sách
 */

let deletingBookId = null;

/**
 * Hiển thị xác nhận xóa
 * @param {number} id - ID sách
 * @param {string} title - Tiêu đề sách
 */
function confirmDelete(id, title) {
    deletingBookId = id;
    document.getElementById('delete-book-title').textContent = escapeHtml(title);
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

/**
 * Xử lý xóa sách
 */
async function submitDelete() {
    try {
        const response = await apiFetch(`/api/books/${deletingBookId}/`, {
            method: 'DELETE'
        });
        
        if (response && response.status === 204) {
            bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
            loadBooks(currentPage, currentPageSize, currentFilters);
            showNotification('Xóa sách thành công!', 'success');
        } else {
            showNotification('Xóa thất bại!', 'danger');
        }
    } catch (error) {
        showNotification('Lỗi kết nối: ' + error.message, 'danger');
    }
}
