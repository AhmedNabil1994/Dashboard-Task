from django.urls import path

from .views import (
    upload_page,
    upload_purchases,
    sales_count,
    top_items,
    search_items,
    profit_report,
    deadstock_items
)

urlpatterns = [
    path('upload-page/', upload_page),
    path('upload-purchases/', upload_purchases),
    path('sales-count/', sales_count),
    path('top-items/', top_items),
    path('search/', search_items),
    path('profit-report/', profit_report),
    path('deadstock/', deadstock_items),
]