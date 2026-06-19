/**
 * Book Edit Management
 * Xử lý chỉnh sửa sách
 */

let editingBookId = null;

/**
 * Hiển thị form chỉnh sửa sách
 * @param {number} id - ID sách
 */
async function showEditForm(id) {
    editingBookId = id;
    
    try {
        const response = await apiFetch(`/api/books/${id}/`);
        if (!response) return;

        const book = await response.json();
        document.getElementById('edit-title').value = book.title;
        document.getElementById('edit-author').value = book.author;
        document.getElementById('edit-price').value = book.price;
        document.getElementById('edit-quantity').value = book.quantity;
        document.getElementById('edit-error').textContent = '';

        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
    } catch (error) {
        showNotification('Lỗi tải dữ liệu: ' + error.message, 'danger');
    }
}

/**
 * Xử lý submit chỉnh sửa sách
 */
async function submitEditBook() {
    const title = document.getElementById('edit-title').value.trim();
    const author = document.getElementById('edit-author').value.trim();
    const price = document.getElementById('edit-price').value.trim();
    const quantity = document.getElementById('edit-quantity').value.trim();
    const errorEl = document.getElementById('edit-error');

    // Validation
    if (!title || !author || !price || !quantity) {
        errorEl.textContent = 'Vui lòng điền đầy đủ thông tin!';
        return;
    }

    if (parseFloat(price) <= 0) {
        errorEl.textContent = 'Giá phải lớn hơn 0!';
        return;
    }

    if (parseInt(quantity) < 0) {
        errorEl.textContent = 'Số lượng không được âm!';
        return;
    }

    // Submit
    try {
        const response = await apiFetch(`/api/books/${editingBookId}/`, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                author,
                price: parseFloat(price),
                quantity: parseInt(quantity)
            }),
        });

        if (response && response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            loadBooks(currentPage, currentPageSize, currentFilters);
            showNotification('Cập nhật sách thành công!', 'success');
        } else {
            const err = await response.json();
            errorEl.textContent = 'Lỗi: ' + JSON.stringify(err);
        }
    } catch (error) {
        errorEl.textContent = 'Lỗi kết nối: ' + error.message;
    }
}
