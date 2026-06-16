function showAddForm() {
    document.getElementById('add-form').reset();
    document.getElementById('add-error').textContent = '';
    const modal = new bootstrap.Modal(document.getElementById('addModal'));
    modal.show();
}

async function submitAddBook() {
    const title = document.getElementById('add-title').value.trim();
    const author = document.getElementById('add-author').value.trim();
    const price = document.getElementById('add-price').value;
    const quantity = document.getElementById('add-quantity').value;
    const errorEl = document.getElementById('add-error');

    if (!title || !author || !price || !quantity) {
        errorEl.textContent = 'Vui long dien day du thong tin!';
        return;
    }

    const response = await apiFetch('/api/books/', {
        method: 'POST',
        body: JSON.stringify({ title, author, price: parseFloat(price), quantity: parseInt(quantity) }),
    });

    if (response.ok) {
        bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
        loadBooks(currentPage, currentPageSize, currentFilters);
    } else {
        const err = await response.json();
        errorEl.textContent = JSON.stringify(err);
    }
}
