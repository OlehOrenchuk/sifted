from django.urls import path

from .views import news_list, news_by_id, filtered_news, GetAllUkrNews, FilteredNews

urlpatterns = [
    path('', news_list, name=''),
    path('newsId=<int:news_id>', news_by_id, name='news_by_id'),
    path('filtered-news/category=<str:category_id__name>', filtered_news, name='filtered_news_by_category'),
    path('filtered-news/sentiment_label=<str:sentiment_label>', filtered_news, name='filtered_news_by_sentiment_label'),

    # API calls urls to get date
    path('api/news_data/', GetAllUkrNews.as_view(), name='news_data'),
    path('api/filtered-news/category=<str:category_id_name>', FilteredNews.as_view(), name='filtered_news'),
    path('api/filtered-news/sentiment_label=<str:sentiment_label>', FilteredNews.as_view(), name='filtered_news'),
]
