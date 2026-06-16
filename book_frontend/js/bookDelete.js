let deletingBookId = null;

function confirmDelete(id, title) {
    deletingBookId = id;
    document.getElementById('delete-book-title').textContent = title;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

async function submitDelete() {
    const response = await apiFetch(`/api/books/${deletingBookId}/`, { method: 'DELETE' });
    if (response.status === 204) {
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        loadBooks(currentPage, currentPageSize, currentFilters);
    } else {
        alert('Xoa that bai!');
    }
}
