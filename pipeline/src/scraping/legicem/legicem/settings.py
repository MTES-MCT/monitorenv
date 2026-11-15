# Scrapy settings for the legicem project.
#
# These settings are only used when running the spider with the `scrapy` CLI
# from the `src/scraping/legicem` folder (e.g. `scrapy crawl legicem -o out.csv`).
# The `Monitorenv - Scrape legicem` flow passes its own settings to the
# `CrawlerProcess`.
#
# See https://docs.scrapy.org/en/latest/topics/settings.html

BOT_NAME = "legicem"

SPIDER_MODULES = ["legicem.spiders"]
NEWSPIDER_MODULE = "legicem.spiders"

# Obey robots.txt rules
ROBOTSTXT_OBEY = True

FEED_EXPORT_ENCODING = "utf-8"
