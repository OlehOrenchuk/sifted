# app_name/admin.py
from django.contrib import admin
from .models import Category, News, NewsEnglish, NewsUkrainian


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['id', 'publication_date', 'sentiment_score', 'sentiment_label', 'news_source', 'category_id']


@admin.register(NewsEnglish)
class NewsEnglishAdmin(admin.ModelAdmin):
    list_display = ['id', 'headline', 'content', 'news_id']


@admin.register(NewsUkrainian)
class NewsUkrainianAdmin(admin.ModelAdmin):
    list_display = ['id', 'headline', 'content', 'news_id']
