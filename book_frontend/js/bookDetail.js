/**
 * Book Detail Management
 * Xử lý hiển thị chi tiết sách
 */

/**
 * Hiển thị chi tiết sách trong modal
 * @param {number} id - ID sách
 */
async function showDetail(id) {
    try {
        const response = await apiFetch(`/api/books/${id}/`);
        if (!response) return;

        const book = await response.json();
        document.getElementById('detail-id').textContent = book.id;
        document.getElementById('detail-title').textContent = escapeHtml(book.title);
        document.getElementById('detail-author').textContent = escapeHtml(book.author);
        document.getElementById('detail-price').textContent = 
            Number(book.price).toLocaleString('vi-VN') + ' VND';
        document.getElementById('detail-quantity').textContent = book.quantity;

        const modal = new bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();
    } catch (error) {
        showNotification('Lỗi tải chi tiết: ' + error.message, 'danger');
    }
}
