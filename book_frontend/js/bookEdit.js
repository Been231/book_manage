let editingBookId = null;

async function showEditForm(id) {
    editingBookId = id;
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
}

async function submitEditBook() {
    const title = document.getElementById('edit-title').value.trim();
    const author = document.getElementById('edit-author').value.trim();
    const price = document.getElementById('edit-price').value;
    const quantity = document.getElementById('edit-quantity').value;
    const errorEl = document.getElementById('edit-error');

    if (!title || !author || !price || !quantity) {
        errorEl.textContent = 'Vui long dien day du thong tin!';
        return;
    }

    const response = await apiFetch(`/api/books/${editingBookId}/`, {
        method: 'PUT',
        body: JSON.stringify({ title, author, price: parseFloat(price), quantity: parseInt(quantity) }),
    });

    if (response.ok) {
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        loadBooks(currentPage, currentPageSize, currentFilters);
    } else {
        const err = await response.json();
        errorEl.textContent = JSON.stringify(err);
    }
}
