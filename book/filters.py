def apply_book_filters(queryset, params):
    title = params.get('title', None)
    if title:
        queryset = queryset.filter(title__icontains=title)
    author = params.get('author', None)
    if author:
        queryset = queryset.filter(author__icontains=author)
    price_min = params.get('price_min', None)
    if price_min:
        try:
            queryset = queryset.filter(price__gte=float(price_min))
        except ValueError:
            pass  # bo qua neu gia tri khong hop le

    price_max = params.get('price_max', None)
    if price_max:
        try:
            queryset = queryset.filter(price__lte=float(price_max))
        except ValueError:
            pass
    quantity_min = params.get('quantity_min', None)
    if quantity_min:
        try:
            queryset = queryset.filter(quantity__gte=int(quantity_min))
        except ValueError:
            pass

    quantity_max = params.get('quantity_max', None)
    if quantity_max:
        try:
            queryset = queryset.filter(quantity__lte=int(quantity_max))
        except ValueError:
            pass

    return queryset
