async function showDetail(id) {
    const response = await apiFetch(`/api/books/${id}/`);
    if (!response) return;

    const book = await response.json();
    document.getElementById('detail-id').textContent = book.id;
    document.getElementById('detail-title').textContent = book.title;
    document.getElementById('detail-author').textContent = book.author;
    document.getElementById('detail-price').textContent = Number(book.price).toLocaleString() + ' VND';
    document.getElementById('detail-quantity').textContent = book.quantity;

    const modal = new bootstrap.Modal(document.getElementById('detailModal'));
    modal.show();
}
