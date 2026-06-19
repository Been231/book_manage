"""
Book filtering utilities
"""


def apply_book_filters(queryset, params):
    """
    Áp dụng filters từ query parameters vào Book queryset
    
    Supported filters:
    - title: Tìm kiếm theo tiêu đề (icontains)
    - author: Tìm kiếm theo tác giả (icontains)
    - price_min: Giá tối thiểu
    - price_max: Giá tối đa
    - quantity_min: Số lượng tối thiểu
    - quantity_max: Số lượng tối đa
    """
    
    # Title filter
    title = params.get('title')
    if title:
        queryset = queryset.filter(title__icontains=title)
    
    # Author filter
    author = params.get('author')
    if author:
        queryset = queryset.filter(author__icontains=author)
    
    # Price range filter
    price_min = params.get('price_min')
    if price_min:
        try:
            queryset = queryset.filter(price__gte=float(price_min))
        except (ValueError, TypeError):
            pass

    price_max = params.get('price_max')
    if price_max:
        try:
            queryset = queryset.filter(price__lte=float(price_max))
        except (ValueError, TypeError):
            pass
    
    # Quantity range filter
    quantity_min = params.get('quantity_min')
    if quantity_min:
        try:
            queryset = queryset.filter(quantity__gte=int(quantity_min))
        except (ValueError, TypeError):
            pass

    quantity_max = params.get('quantity_max')
    if quantity_max:
        try:
            queryset = queryset.filter(quantity__lte=int(quantity_max))
        except (ValueError, TypeError):
            pass

    return queryset
