from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'authors', views.AuthorViewSet, basename='authors')
router.register(r'publishers', views.PublishersViewSet, basename='publishers')
router.register(r'titles', views.TitleViewSet, basename='titles')
router.register(r'users', views.UserViewSet, basename='users')
router.register(r'reservations', views.ReservationViewSet, basename='reservations')

urlpatterns = [
    path('', views.accueil, name='accueil'),
    path('books/', views.liste_livres, name='liste_livres'),
    path('books/<int:id>/', views.detail_livre, name='detail_livre'),
    path('books/<int:title_id>/reserver/', views.reserver_livre, name='reserver_livre'),
    path('authors/<int:au_id>/livres/', views.livres_par_auteur, name='livres_par_auteur'),
    path('all-authors/', views.liste_auteurs, name='liste_auteurs'),
    path('all-publishers/', views.liste_editeurs, name='liste_editeurs'),
    path('my-reservations/', views.mes_reservations, name='mes_reservations'),
    path('login/', views.connexion, name='connexion'),
    path('logout/', views.LogoutView.as_view(), name='deconnexion'),
    path('signup/', views.inscription, name='inscription'),
    path('', include(router.urls)),
    path('api/user/register/', views.CreateUserView.as_view(), name="register"),
]
