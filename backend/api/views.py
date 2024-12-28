from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView

from .models import Author, Title, Publishers, Reservation, User
from .serializers import (
    AuthorSerializer,
    PublishersSerializer,
    TitleSerializer,
    UserSerializer,
    ReservationSerializer,
)
from .forms import CustomUserCreationForm

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


# PAGE D'ACCUEIL
@api_view(['GET'])
@permission_classes([AllowAny])
@cache_page(60 * 15) 
def accueil(request):
    return Response({"message": "Welcome to the Online Library API"}, status=status.HTTP_200_OK)


# LISTE DES LIVRES
@api_view(['GET'])
@permission_classes([AllowAny])
@cache_page(60 * 15)  
def liste_livres(request):
    cache_key = 'all_books_list'
    livres = cache.get(cache_key)
    if livres is None:
        livres = Title.objects.all()
        cache.set(cache_key, livres, 300)  

    serializer = TitleSerializer(livres, many=True)

    livres_reserves_data = []
    if request.user.is_authenticated:
        livres_reserves = Title.objects.filter(
            reservations__user=request.user,
            reservations__returned_at__isnull=True
        )
        serializer_reserves = TitleSerializer(livres_reserves, many=True)
        livres_reserves_data = serializer_reserves.data

    return Response({
        'books': serializer.data,
        'reserved_books_by_user': livres_reserves_data
    }, status=status.HTTP_200_OK)


# MES RESERVATIONS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mes_reservations(request):

    cache_key = f'reservations_{request.user.id}'
    reservations_cached = cache.get(cache_key)

    if reservations_cached is None:
        reservations_qs = Reservation.objects.filter(user=request.user)
        cache.set(cache_key, reservations_qs, 300)  
        reservations = reservations_qs
    else:
        reservations = reservations_cached

    serializer = ReservationSerializer(reservations, many=True)
    return Response({'reservations': serializer.data}, status=status.HTTP_200_OK)


# LISTE DES AUTEURS
@api_view(['GET'])
@permission_classes([AllowAny])
@cache_page(60 * 15)
def liste_auteurs(request):
    cache_key = 'all_authors_list'
    auteurs = cache.get(cache_key)
    if auteurs is None:
        auteurs = Author.objects.all()
        cache.set(cache_key, auteurs, 300)
    serializer = AuthorSerializer(auteurs, many=True)
    return Response({'authors': serializer.data}, status=status.HTTP_200_OK)


# LIVRES PAR AUTEUR
@api_view(['GET'])
@permission_classes([AllowAny])
@cache_page(60 * 15)
def livres_par_auteur(request, au_id):
    auteur = get_object_or_404(Author, pk=au_id)
    livres = auteur.titles.all()
    serializer = TitleSerializer(livres, many=True)
    return Response({
        'author': AuthorSerializer(auteur).data,
        'books': serializer.data
    }, status=status.HTTP_200_OK)


# LISTE DES EDITEURS
@api_view(['GET'])
@permission_classes([AllowAny])
@cache_page(60 * 15)
def liste_editeurs(request):
    cache_key = 'all_publishers_list'
    editeurs = cache.get(cache_key)
    if editeurs is None:
        editeurs = Publishers.objects.all()
        cache.set(cache_key, editeurs, 300)
    serializer = PublishersSerializer(editeurs, many=True)
    return Response({'publishers': serializer.data}, status=status.HTTP_200_OK)


# DETAIL D'UN LIVRE
@api_view(['GET'])
@permission_classes([AllowAny])
@cache_page(60 * 15)
def detail_livre(request, id):
    livre = get_object_or_404(Title, pk=id)
    serializer = TitleSerializer(livre)
    return Response({'book': serializer.data}, status=status.HTTP_200_OK)


# RESERVER UN LIVRE
@api_view(['POST'])
def reserver_livre(request, title_id):
    if not request.user.is_authenticated:
        return Response({"error": "You must be logged in to reserve a book."}, status=status.HTTP_401_UNAUTHORIZED)

    livre = get_object_or_404(Title, pk=title_id)

   
    if Reservation.objects.filter(user=request.user, book=livre, returned_at__isnull=True).exists():
        raise ValidationError("You have already reserved this book.")

    active_count = Reservation.objects.filter(user=request.user, returned_at__isnull=True).count()
    if active_count >= 3:
        raise ValidationError("You already have 3 active reservations. Please return a book before reserving another.")

    Reservation.objects.create(user=request.user, book=livre)

    cache_key = f'reservations_{request.user.id}'
    cache.delete(cache_key)

    return Response({
        "message": f"You have successfully reserved the book: {livre.title}."
    }, status=status.HTTP_201_CREATED)


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def inscription(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return Response({"message": "Account created successfully. Please login."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"errors": form.errors}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Send a POST request with the required fields to create an account."}, status=status.HTTP_200_OK)


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def connexion(request):
    if request.method == 'POST':
        email = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Login successful."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Incorrect email or password."}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Send a POST request with 'username' and 'password'."}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):

    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie("refresh_token")
        return response


# VIEWSETS

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def livres(self, request, pk=None):
        auteur = self.get_object()
        livres = auteur.titles.all()
        serializer = TitleSerializer(livres, many=True)
        return Response({'books': serializer.data}, status=status.HTTP_200_OK)


class PublishersViewSet(viewsets.ModelViewSet):
    queryset = Publishers.objects.all()
    serializer_class = PublishersSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class TitleViewSet(viewsets.ModelViewSet):
    queryset = Title.objects.all()
    serializer_class = TitleSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    @action(detail=True, methods=['post'])
    def reserver(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({"error": "You must be logged in to reserve a book."}, status=status.HTTP_401_UNAUTHORIZED)

        title = self.get_object()
        if Reservation.objects.filter(user=request.user, book=title, returned_at__isnull=True).exists():
            raise ValidationError("You have already reserved this book.")

        active_res_count = Reservation.objects.filter(user=request.user, returned_at__isnull=True).count()
        if active_res_count >= 3:
            raise ValidationError("You already have 3 active reservations. Return a book first.")

        reservation = Reservation.objects.create(user=request.user, book=title)
        serializer = ReservationSerializer(reservation)

        cache_key = f'reservations_{request.user.id}'
        cache.delete(cache_key)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAdminUser]


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        elif self.action in ['update', 'partial_update', 'destroy']:
          
            return [permissions.IsAuthenticated()]
     
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        user = self.request.user
        active_count = Reservation.objects.filter(user=user, returned_at__isnull=True).count()
        if active_count >= 3:
            raise ValidationError("You already have 3 active reservations.")
        serializer.save(user=user)

        cache_key = f'reservations_{user.id}'
        cache.delete(cache_key)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user and not request.user.is_superuser:
            raise ValidationError("You cannot cancel this reservation because it does not belong to you.")

        self.perform_destroy(instance)

        cache_key = f'reservations_{instance.user.id}'
        cache.delete(cache_key)

        return Response({"message": "Reservation successfully canceled."}, status=status.HTTP_200_OK)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        data = response.data

        access_token = data.get("access")
        refresh_token = data.get("refresh")

        res = Response({"access": access_token}, status=status.HTTP_200_OK)
        res.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=86400, 
        )
        return res


class RefreshAccessTokenView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"error": "No refresh token provided"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            return Response({"access": access_token}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)
