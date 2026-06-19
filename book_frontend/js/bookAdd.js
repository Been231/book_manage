/**
 * Book Add Management
 * Xử lý form thêm sách mới
 */

/**
 * Hiển thị modal thêm sách
 */
function showAddForm() {
    document.getElementById('add-form').reset();
    document.getElementById('add-error').textContent = '';
    const modal = new bootstrap.Modal(document.getElementById('addModal'));
    modal.show();
}

/**
 * Xử lý submit thêm sách mới
 */
async function submitAddBook() {
    const title = document.getElementById('add-title').value.trim();
    const author = document.getElementById('add-author').value.trim();
    const price = document.getElementById('add-price').value.trim();
    const quantity = document.getElementById('add-quantity').value.trim();
    const errorEl = document.getElementById('add-error');

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
        const response = await apiFetch('/api/books/', {
            method: 'POST',
            body: JSON.stringify({
                title,
                author,
                price: parseFloat(price),
                quantity: parseInt(quantity)
            }),
        });

        if (response && response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
            loadBooks(currentPage, currentPageSize, currentFilters);
            showNotification('Thêm sách thành công!', 'success');
        } else {
            const err = await response.json();
            errorEl.textContent = 'Lỗi: ' + JSON.stringify(err);
        }
    } catch (error) {
        errorEl.textContent = 'Lỗi kết nối: ' + error.message;
    }
}

/**
 * Hiển thị notification
 * @param {string} message - Thông báo
 * @param {string} type - Loại (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show`;
    toast.role = 'alert';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.insertBefore(toast, document.body.firstChild);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
