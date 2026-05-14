from django.db import models


class Item(models.Model):
    item_code = models.CharField(max_length=100, unique=True)
    item_name = models.CharField(max_length=500)
    barcode = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.item_name


class Sale(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity_sold = models.FloatField(default=0)
    sales_value = models.FloatField(default=0)

    def __str__(self):
        return f"Sale - {self.item.item_name}"


class Purchase(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity_purchased = models.FloatField(default=0)
    purchase_value = models.FloatField(default=0)

    def __str__(self):
        return f"Purchase - {self.item.item_name}"


class ItemAnalysis(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE)

    total_sold_quantity = models.FloatField(default=0)
    total_sales_value = models.FloatField(default=0)

    total_purchased_quantity = models.FloatField(default=0)
    total_purchase_value = models.FloatField(default=0)

    profit = models.FloatField(default=0)
    is_deadstock = models.BooleanField(default=False)

    def __str__(self):
        return f"Analysis - {self.item.item_name}"