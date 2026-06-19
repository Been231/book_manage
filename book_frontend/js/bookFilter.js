/**
 * Book Filter Management
 * Xử lý tìm kiếm và filter sách
 */

/**
 * Áp dụng filters và tải lại danh sách
 */
function applyFilter() {
    const title = document.getElementById('filter-title').value.trim();
    const author = document.getElementById('filter-author').value.trim();
    const filters = {};
    
    if (title) filters.title = title;
    if (author) filters.author = author;
    
    loadBooks(1, currentPageSize, filters);
}

/**
 * Reset filters và tải lại danh sách
 */
function resetFilter() {
    document.getElementById('filter-title').value = '';
    document.getElementById('filter-author').value = '';
    loadBooks(1, currentPageSize, {});
}
