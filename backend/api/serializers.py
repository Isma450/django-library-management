from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import Author, Publishers, Title, User, Reservation

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['au_id', 'author', 'year_born']

class PublishersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publishers
        fields = '__all__'

class TitleSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True) 
    
    class Meta:
        model = Title
        fields = ['title_id', 'isbn', 'title', 'year_published', 'pubid', 'description', 'notes', 'subject', 'comments', 'cover_image', 'authors']
    
   
    def create(self, validated_data):
        cover_image = validated_data.pop('cover_image', None)
        title = Title.objects.create(**validated_data)
        if cover_image:
            title.cover_image = cover_image
            title.save()
        return title

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'date_of_birth', 'is_active', 'is_staff', 'password'] 
        extra_kwargs = {
            'password': {'write_only': True},  
        }
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class ReservationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    book = serializers.PrimaryKeyRelatedField(queryset=Title.objects.all())

    class Meta:
        model = Reservation
        fields = ['id', 'user', 'book', 'reserved_at', 'returned_at']
        read_only_fields = ['reserved_at', 'returned_at']  

    def create(self, validated_data):
        user = self.context['request'].user
        book = validated_data.pop('book')
        
       
        if not book.reservations.filter(returned_at__isnull=True).exists():
            reservation = Reservation.objects.create(user=user, book=book, **validated_data)
            return reservation
        else:
            raise serializers.ValidationError("Ce livre n'est pas disponible pour la réservation.")

   
    def update(self, instance, validated_data):
        if self.context['request'].user != instance.user:
            raise serializers.ValidationError("Vous ne pouvez pas modifier cette réservation.")
        
        instance.returned_at = validated_data.get('returned_at', instance.returned_at)
        instance.save()
        return instance