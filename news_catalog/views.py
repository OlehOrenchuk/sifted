from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views import View
from django.db.models import Count

from .models import Category, News, NewsEnglish, NewsUkrainian


def news_list(request):
    # categories = Category.objects.all()

    # Отримати топ-10 категорій з найбільшою кількістю пов'язаних статей
    categories = Category.objects.annotate(num_articles=Count('news')).order_by('-num_articles')[:10]

    news = News.objects.all()
    news_english = NewsEnglish.objects.all()
    news_ukrainian = NewsUkrainian.objects.all()

    return render(request, 'news_catalog/news_list.html',
                  {'categories': categories, 'news': news, 'news_english': news_english,
                   'news_ukrainian': news_ukrainian})


def news_by_id(request, news_id=None):
    if news_id is None:
        return render(request, 'news_catalog/news_by_id.html', {'error': 'News ID not provided'})

    try:
        # Отримати топ-10 категорій з найбільшою кількістю пов'язаних статей
        categories = Category.objects.annotate(num_articles=Count('news')).order_by('-num_articles')[:10]

        # Retrieve the specific news item by news_id__id
        news_item = NewsUkrainian.objects.select_related('news_id').values(
            'id', 'headline', 'content', 'news_id__id', 'news_id__publication_date',
            'news_id__sentiment_score', 'news_id__sentiment_label',
            'news_id__news_source', 'news_id__image_url', 'news_id__category_id_id',
            'news_id__category_id__name'
        ).get(news_id__id=news_id)

        print(news_item)

        news_item['content'] = news_item['content'].replace('\\n', '\n')

        # Render the news_by_id template with the news item data
        return render(request, 'news_catalog/news_by_id.html', {'news_item': news_item, 'categories': categories})

    except NewsUkrainian.DoesNotExist:
        # If the news item is not found, render the news_by_id template with an error message
        return render(request, 'news_catalog/page_not_found.html', {'error': 'News not found'})

    except Exception as e:
        # If there's an exception, render the news_by_id template with an error message
        return render(request, 'news_catalog/news_by_id.html', {'error': str(e)})


def filtered_news(request, category_id__name=None, sentiment_label=None):
    # categories = Category.objects.all()

    # Отримати топ-10 категорій з найбільшою кількістю пов'язаних статей
    categories = Category.objects.annotate(num_articles=Count('news')).order_by('-num_articles')[:10]

    filtered_news = NewsUkrainian.objects.select_related('news_id').values(
        'id', 'headline', 'content', 'news_id__id', 'news_id__publication_date', 'news_id__sentiment_score',
        'news_id__sentiment_label',
        'news_id__news_source', 'news_id__image_url', 'news_id__category_id_id', 'news_id__category_id__name'
    )

    if category_id__name:
        # Filter by category
        filtered_news = filtered_news.filter(news_id__category_id__name=category_id__name)

    if sentiment_label:
        # Filter by sentiment_label
        filtered_news = filtered_news.filter(news_id__sentiment_label=sentiment_label)

    return render(request, '../templates/news_catalog/filtered_news.html',
                  {'filtered_news': filtered_news, 'categories': categories})


class GetAllUkrNews(View):
    def get(self, request, *args, **kwargs):
        allow_access = request.headers.get('allowAccess', None)

        # Перевірте, чи передано поле allowAccess і його значення
        if allow_access == 'true':
            # Ваш код отримання новин
            news_data = NewsUkrainian.objects.select_related('news_id').values(
                'id', 'headline', 'content', 'news_id__id', 'news_id__publication_date', 'news_id__sentiment_score',
                'news_id__sentiment_label',
                'news_id__news_source', 'news_id__image_url', 'news_id__category_id_id', 'news_id__category_id__name'
            ).order_by('-news_id__publication_date')  # Order by publication_date in descending order

            return JsonResponse(list(news_data), safe=False, status=200)
        else:
            return redirect("/")


class FilteredNews(View):
    def get(self, request, *args, **kwargs):
        allow_access = request.headers.get('allowAccess', None)

        # Перевірте, чи передано поле allowAccess і його значення
        if allow_access == 'true':

            # Get the parameters from the URL
            category_id_name = self.kwargs.get('category_id_name')
            sentiment_label = self.kwargs.get('sentiment_label')

            # Retrieve filtered news data
            filtered_news = NewsUkrainian.objects.select_related('news_id').values(
                'id', 'headline', 'content', 'news_id__id', 'news_id__publication_date', 'news_id__sentiment_score',
                'news_id__sentiment_label',
                'news_id__news_source', 'news_id__image_url', 'news_id__category_id_id', 'news_id__category_id__name'
            ).order_by('-news_id__publication_date')  # Order by publication_date in descending order

            # Apply filters if provided
            if category_id_name:
                filtered_news = filtered_news.filter(news_id__category_id__name=category_id_name)

            if sentiment_label:
                filtered_news = filtered_news.filter(news_id__sentiment_label=sentiment_label)


            # Check if either category_id_name or sentiment_label is provided
            if not category_id_name and not sentiment_label:
                return JsonResponse({'error': 'Provide either category_id_name or sentiment_label'}, status=400)

            # Convert the filtered news data to a list
            filtered_news_list = list(filtered_news)

            # Return a JSON response
            return JsonResponse({'filtered_news': filtered_news_list}, status=200)

        else:
            return redirect("/")
