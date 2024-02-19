from django.db import models

class Category(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)
    name = models.CharField(db_column='Name', unique=True, max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'Category'

class News(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)
    publication_date = models.DateTimeField(db_column='PublicationDate')
    sentiment_score = models.FloatField(db_column='SentimentScore')
    sentiment_label = models.CharField(db_column='SentimentLabel', max_length=15)
    news_source = models.CharField(db_column='NewsSource', unique=True, max_length=255)
    image_url = models.CharField(db_column='ImageUrl', max_length=255, blank=True, null=True)
    category_id = models.ForeignKey(Category, models.DO_NOTHING, db_column='CategoryId')

    def __str__(self):
        return str(self.pk)

    class Meta:
        db_table = 'News'

class NewsEnglish(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)
    headline = models.CharField(db_column='Headline', max_length=300)
    content = models.TextField(db_column='Content')
    news_id = models.OneToOneField(News, models.DO_NOTHING, db_column='NewsId')

    def __str__(self):
        return str(self.pk)

    class Meta:
        db_table = 'NewsEnglish'

class NewsUkrainian(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)
    headline = models.CharField(db_column='Headline', max_length=300)
    content = models.TextField(db_column='Content')
    news_id = models.OneToOneField(News, models.DO_NOTHING, db_column='NewsId')

    def __str__(self):
        return str(self.pk)

    class Meta:
        db_table = 'NewsUkrainian'
